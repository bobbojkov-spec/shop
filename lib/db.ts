import mysql from 'mysql2/promise';

// Singleton pattern to ensure only one pool instance
// In Next.js 14, params are not Promises, so we don't need the complex pool recreation logic
let pool: mysql.Pool | null = null;

function createPool(): mysql.Pool {
  return mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'shop_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    idleTimeout: 30000,
    // Prevent malformed packet errors
    multipleStatements: false,
    // Connection timeout
    connectTimeout: 10000,
  });
}

function getPool(): mysql.Pool {
  if (!pool) {
    console.log('🔄 Creating MySQL connection pool...');
    pool = createPool();
    
    // Handle pool errors
    pool.on('error', (err) => {
      console.error('❌ MySQL Pool Error:', err.code, err.message);
    });
  }
  return pool;
}

// Database connection pool
const dbPool = getPool();

// Graceful shutdown
if (typeof process !== 'undefined') {
  process.on('SIGINT', async () => {
    if (pool) {
      await pool.end();
      pool = null;
    }
  });
  
  process.on('SIGTERM', async () => {
    if (pool) {
      await pool.end();
      pool = null;
    }
  });
}

export default dbPool;
