import mysql from 'mysql2/promise';
import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';

require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'shop_db';
const SQLITE_DB_PATH = path.join(process.cwd(), 'database', 'shop.db');

async function migrate() {
  console.log('🚀 Starting migration...\n');
  
  const mysqlConn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  try {
    const dbDir = path.dirname(SQLITE_DB_PATH);
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    if (fs.existsSync(SQLITE_DB_PATH)) fs.unlinkSync(SQLITE_DB_PATH);
    
    const sqlite = new Database(SQLITE_DB_PATH);
    sqlite.pragma('foreign_keys = ON');

    const [tables] = await mysqlConn.execute(`SHOW TABLES`) as any[];
    const tableKey = `Tables_in_${DB_NAME}`;
    const tableNames = tables.map((t: any) => t[tableKey]).filter(Boolean);

    console.log(`📋 Found ${tableNames.length} tables\n`);

    for (const tableName of tableNames) {
      console.log(`🔄 ${tableName}...`);
      
      const [cols] = await mysqlConn.execute(
        `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
         FROM information_schema.columns 
         WHERE table_schema = ? AND table_name = ? ORDER BY ordinal_position`,
        [DB_NAME, tableName]
      ) as any[];

      const colDefs: string[] = [];
      for (const col of cols) {
        const name = col.COLUMN_NAME;
        const type = col.DATA_TYPE.toUpperCase();
        const nullable = col.IS_NULLABLE === 'NO';
        const extra = col.EXTRA || '';
        const def = col.COLUMN_DEFAULT;
        
        let sqlType = 'TEXT';
        if (type.includes('INT')) sqlType = 'INTEGER';
        else if (type.includes('DECIMAL') || type.includes('FLOAT') || type.includes('DOUBLE')) sqlType = 'REAL';
        else if (type.includes('BLOB')) sqlType = 'BLOB';
        
        let colDef = `"${name}" ${sqlType}`;
        
        if (extra.includes('auto_increment')) {
          colDef += ' PRIMARY KEY AUTOINCREMENT';
        } else if (name === 'id') {
          const [pk] = await mysqlConn.execute(
            `SELECT column_name FROM information_schema.key_column_usage 
             WHERE table_schema = ? AND table_name = ? AND constraint_name = 'PRIMARY' AND column_name = ?`,
            [DB_NAME, tableName, name]
          ) as any[];
          if (pk && pk.length > 0) colDef += ' PRIMARY KEY';
        }
        
        if (nullable && !colDef.includes('PRIMARY KEY')) colDef += ' NOT NULL';
        if (def !== null && def !== undefined) {
          colDef += typeof def === 'string' ? ` DEFAULT '${def}'` : ` DEFAULT ${def}`;
        }
        
        colDefs.push(colDef);
      }

      sqlite.exec(`CREATE TABLE "${tableName}" (${colDefs.join(', ')})`);
      console.log(`  ✅ Created`);

      const [rows] = await mysqlConn.execute(`SELECT * FROM ${tableName}`) as any[];
      if (rows.length > 0) {
        const colNames = cols.map((c: any) => `"${c.COLUMN_NAME}"`).join(', ');
        const placeholders = cols.map(() => '?').join(', ');
        const insertSQL = `INSERT INTO "${tableName}" (${colNames}) VALUES (${placeholders})`;
        const stmt = sqlite.prepare(insertSQL);
        
        const insertMany = sqlite.transaction((rows: any[]) => {
          for (const row of rows) {
            const values = cols.map((col: any) => {
              const val = row[col.COLUMN_NAME];
              if (val === null || val === undefined) return null;
              if (val instanceof Date) return val.toISOString();
              return val;
            });
            stmt.run(...values);
          }
        });
        
        insertMany(rows);
        console.log(`  ✅ Inserted ${rows.length} rows`);
      }
    }

    await mysqlConn.end();
    sqlite.close();

    console.log(`\n✅ Migration complete!`);
    console.log(`📁 Database: ${SQLITE_DB_PATH}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
    await mysqlConn.end();
    process.exit(1);
  }
}

migrate();
