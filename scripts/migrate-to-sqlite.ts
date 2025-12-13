import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'shop_db';

const SQLITE_DB_PATH = path.join(process.cwd(), 'database', 'shop.db');

async function migrateToSQLite() {
  console.log('🚀 Starting migration from MySQL to SQLite...\n');

  // Connect to MySQL
  console.log('📡 Connecting to MySQL...');
  const mysqlConn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  try {
    // Create SQLite database
    console.log('💾 Creating SQLite database...');
    const dbDir = path.dirname(SQLITE_DB_PATH);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    // Remove existing SQLite DB if it exists
    if (fs.existsSync(SQLITE_DB_PATH)) {
      fs.unlinkSync(SQLITE_DB_PATH);
    }
    
    const sqlite = new Database(SQLITE_DB_PATH);
    sqlite.pragma('foreign_keys = ON');

    // Get all table names from MySQL
    const [tables] = await mysqlConn.execute(`SHOW TABLES`) as any[];
    
    // MySQL returns table names in a dynamic column name like `Tables_in_${DB_NAME}`
    const tableKey = `Tables_in_${DB_NAME}`;
    const tableNames = tables
      .map((t: any) => t[tableKey])
      .filter((name: any): name is string => Boolean(name) && typeof name === 'string');
    
    console.log(`\n📋 Found ${tableNames.length} tables: ${tableNames.join(', ')}\n`);
    
    if (tableNames.length === 0) {
      throw new Error('No tables found in database');
    }

    // Create tables and migrate data
    for (const tableName of tableNames) {
      console.log(`\n🔄 Processing table: ${tableName}`);

      // Get table structure
      const [columns] = await mysqlConn.execute(
        `SELECT column_name, data_type, is_nullable, column_default, extra
         FROM information_schema.columns 
         WHERE table_schema = ? AND table_name = ?
         ORDER BY ordinal_position`,
        [DB_NAME, tableName]
      ) as any[];
      
      if (!columns || columns.length === 0) {
        console.log(`  ⚠️  No columns found, skipping`);
        continue;
      }

      // Build CREATE TABLE statement
      let createTableSQL = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
      const columnDefs: string[] = [];

      for (const col of columns) {
        let colDef = `  "${col.column_name || col.COLUMN_NAME}" `;
        
        // Map MySQL types to SQLite types
        const mysqlType = col.data_type || col.DATA_TYPE || "TEXT".toUpperCase();
        if (mysqlType.includes('INT')) {
          colDef += 'INTEGER';
        } else if (mysqlType.includes('DECIMAL') || mysqlType.includes('FLOAT') || mysqlType.includes('DOUBLE')) {
          colDef += 'REAL';
        } else if (mysqlType.includes('TEXT') || mysqlType.includes('VARCHAR') || mysqlType.includes('CHAR')) {
          colDef += 'TEXT';
        } else if (mysqlType.includes('BLOB')) {
          colDef += 'BLOB';
        } else if (mysqlType.includes('DATETIME') || mysqlType.includes('TIMESTAMP')) {
          colDef += 'TEXT';
        } else if (mysqlType.includes('DATE')) {
          colDef += 'TEXT';
        } else {
          colDef += 'TEXT';
        }

        // Add PRIMARY KEY or AUTO_INCREMENT
        if (col.extra && col.extra.includes('auto_increment')) {
          colDef += ' PRIMARY KEY AUTOINCREMENT';
        } else if (col.column_name || col.COLUMN_NAME === 'id' && !colDef.includes('PRIMARY KEY')) {
          // Check if this is a primary key
          const [pkCheck] = await mysqlConn.execute(
            `SELECT column_name FROM information_schema.key_column_usage 
             WHERE table_schema = ? AND table_name = ? AND constraint_name = 'PRIMARY' AND column_name = ?`,
            [DB_NAME, tableName, col.column_name || col.COLUMN_NAME]
          ) as any[];
          if (pkCheck.length > 0) {
            colDef += ' PRIMARY KEY';
          }
        }

        // Add NOT NULL
        if (col.is_nullable === 'NO' && !colDef.includes('PRIMARY KEY')) {
          colDef += ' NOT NULL';
        }

        // Add DEFAULT
        if (col.column_default !== null && col.column_default !== undefined) {
          if (typeof col.column_default === 'string') {
            colDef += ` DEFAULT '${col.column_default}'`;
          } else {
            colDef += ` DEFAULT ${col.column_default}`;
          }
        }

        columnDefs.push(colDef);
      }

      createTableSQL += columnDefs.join(',\n') + '\n)';
      
      // Create table in SQLite
      sqlite.exec(createTableSQL);
      console.log(`  ✅ Created table structure`);

      // Get data from MySQL
      const [rows] = await mysqlConn.execute(`SELECT * FROM ${tableName}`) as any[];
      console.log(`  📦 Found ${rows.length} rows`);

      if (rows.length > 0) {
        // Prepare insert statement
        const columnNames = columns.map((c: any) => c.column_name).join(', ');
        const placeholders = columns.map(() => '?').join(', ');
        const insertSQL = `INSERT INTO ${tableName} (${columnNames}) VALUES (${placeholders})`;
        const stmt = sqlite.prepare(insertSQL);

        // Insert data in transaction
        const insertMany = sqlite.transaction((rows: any[]) => {
          for (const row of rows) {
            const values = columns.map((col: any) => {
              const value = row[col.column_name || col.COLUMN_NAME];
              // Handle NULL values
              if (value === null || value === undefined) {
                return null;
              }
              // Handle dates
              if (value instanceof Date) {
                return value.toISOString();
              }
              return value;
            });
            stmt.run(...values);
          }
        });

        insertMany(rows);
        console.log(`  ✅ Inserted ${rows.length} rows`);
      }
    }

    // Close connections
    await mysqlConn.end();
    sqlite.close();

    console.log(`\n✅ Migration complete!`);
    console.log(`📁 SQLite database: ${SQLITE_DB_PATH}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Update lib/db.ts to use SQLite`);
    console.log(`   2. Restart your dev server`);
    console.log(`   3. Test the admin panel`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mysqlConn.end();
    process.exit(1);
  }
}

migrateToSQLite();

