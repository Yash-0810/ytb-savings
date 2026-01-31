import Database from 'better-sqlite3';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

type DatabaseInstance = InstanceType<typeof Database>;

let db: DatabaseInstance | null = null;

// Check if we should use PostgreSQL (for production)
const usePostgreSQL = process.env.DATABASE_URL?.startsWith('postgresql://');

if (usePostgreSQL) {
  // PostgreSQL will be used when DATABASE_URL is set to a PostgreSQL connection string
  console.log('PostgreSQL configuration detected. Use pg module for production.');
} else {
  // Default: SQLite for local development
  const dbPath = process.env.DATABASE_URL || path.resolve(__dirname, '../../finance.db');
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
}

export function initializeDatabase(): DatabaseInstance {
  if (usePostgreSQL) {
    console.log('Using PostgreSQL database (production mode)');
    // For PostgreSQL, you would use the 'pg' module here
    // This is a placeholder - in production, install pg and use it
    return null as unknown as DatabaseInstance;
  }

  if (!db) {
    const dbPath = process.env.DATABASE_URL || path.resolve(__dirname, '../../finance.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }

  // Create users table
  db.exec(`
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
  db.exec(`
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
  db.exec(`
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
  db.exec(`
    CREATE TABLE IF NOT EXISTS otp_verifications (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      otp TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create password reset tokens table
  db.exec(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log('Database initialized successfully');
  return db;
}

export function getDatabase(): DatabaseInstance {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}
