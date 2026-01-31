import pg, { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool: PgPool } = pg;

// PostgreSQL connection pool
let pool: Pool | null = null;

// Check if we should use PostgreSQL (for production)
const usePostgreSQL = process.env.DATABASE_URL?.startsWith('postgresql://');

async function initializePostgreSQL(): Promise<Pool> {
  const databaseUrl = process.env.DATABASE_URL!;
  
  pool = new PgPool({
    connectionString: databaseUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Test connection
  const client = await pool.connect();
  try {
    await client.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully');
  } finally {
    client.release();
  }

  return pool;
}

async function createPostgreSQLTables(client: PoolClient): Promise<void> {
  // Create users table
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT,
      google_id TEXT UNIQUE,
      is_verified BOOLEAN DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create transactions table
  await client.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT NOT NULL,
      category TEXT,
      payment_method TEXT DEFAULT 'cash',
      date TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create user_profiles table
  await client.query(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create OTP table for email verification
  await client.query(`
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      otp TEXT NOT NULL,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create password reset tokens table
  await client.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await client.query(`CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date)`);
  await client.query(`CREATE INDEX IF NOT EXISTS idx_otp_verifications_email ON otp_verifications(email)`);
}

// For SQLite (local development)
let sqliteDb: any = null;
let SQLite: any = null;

function initializeSQLite() {
  const path = require('path');
  const Database = require('better-sqlite3');
  const dbPath = process.env.DATABASE_URL || path.resolve(__dirname, '../../finance.db');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');
  return sqliteDb;
}

export async function initializeDatabase(): Promise<any> {
  if (usePostgreSQL) {
    console.log('Using PostgreSQL database (production mode)');
    pool = await initializePostgreSQL();
    
    const client = await pool.connect();
    try {
      await createPostgreSQLTables(client);
      console.log('PostgreSQL database initialized successfully');
    } finally {
      client.release();
    }
    
    return pool;
  }

  console.log('Using SQLite database (local development)');
  SQLite = require('better-sqlite3');
  sqliteDb = initializeSQLite();
  
  // Create users table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT,
      google_id TEXT UNIQUE,
      is_verified BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create transactions table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      description TEXT NOT NULL,
      category TEXT,
      payment_method TEXT DEFAULT 'cash',
      date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create user_profiles table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id TEXT PRIMARY KEY,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip_code TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Create OTP table for email verification
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      otp TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create password reset tokens table
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('SQLite database initialized successfully');
  return sqliteDb;
}

export async function query(text: string, params?: any[]): Promise<QueryResult<any>> {
  if (!pool && !sqliteDb) {
    throw new Error('Database not initialized');
  }
  
  if (pool) {
    return pool.query(text, params);
  }
  
  // SQLite synchronous query wrapper
  const stmt = sqliteDb.prepare(text);
  let rows: any[];
  if (params && params.length > 0) {
    rows = stmt.all(...params);
  } else {
    rows = stmt.all();
  }
  
  // Return a proper QueryResult-like object
  return {
    rows,
    rowCount: rows.length,
    command: 'SELECT',
    oid: 0,
    fields: []
  };
}

export async function getClient(): Promise<PoolClient | any> {
  if (pool) {
    return pool.connect();
  }
  return sqliteDb;
}

export function getPool(): Pool | null {
  return pool;
}

export function closeDatabase(): Promise<void> {
  if (pool) {
    return pool.end();
  }
  return Promise.resolve();
}

