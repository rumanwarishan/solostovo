import mysql, { type Pool } from "mysql2/promise";
import { generateId, hashPassword } from "./auth";

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function isDbConfigured(): boolean {
  return Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);
}

function getPool(): Pool {
  if (pool) return pool;
  if (!isDbConfigured()) {
    throw new Error(
      "Database is not configured. Set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME (see .env.example)."
    );
  }
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    dateStrings: true,
  });
  return pool;
}

/**
 * Creates every table if it doesn't already exist. Called lazily before the
 * first query each server instance makes, so pointing DB_* env vars at a
 * fresh MySQL database is the entire setup step — no manual SQL, no SSH.
 * The equivalent CREATE TABLE statements are documented in README.md for
 * anyone who wants to run them by hand instead (e.g. via phpMyAdmin).
 */
async function migrate(): Promise<void> {
  const db = getPool();

  await db.query(`
    CREATE TABLE IF NOT EXISTS categories (
      slug VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      sort_order INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(64) PRIMARY KEY,
      slug VARCHAR(255) NOT NULL UNIQUE,
      name VARCHAR(255) NOT NULL,
      family VARCHAR(64) NOT NULL,
      fit VARCHAR(32) NULL,
      fuel VARCHAR(32) NULL,
      price DECIMAL(10,2) NOT NULL,
      compare_at_price DECIMAL(10,2) NULL,
      rating DECIMAL(2,1) NOT NULL DEFAULT 0,
      review_count INT NOT NULL DEFAULT 0,
      badges JSON NULL,
      short_description TEXT,
      description TEXT,
      specs JSON NULL,
      variants JSON NULL,
      image_tone VARCHAR(255) NOT NULL DEFAULT 'from-[#3a4a3f] to-[#1f2b23]',
      cross_sell JSON NULL,
      compare_group VARCHAR(64) NULL,
      stock INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (family) REFERENCES categories(slug) ON DELETE RESTRICT,
      INDEX (family)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(64) PRIMARY KEY,
      customer_email VARCHAR(255) NOT NULL,
      customer_name VARCHAR(255) NOT NULL,
      total DECIMAL(10,2) NOT NULL,
      status ENUM('paid','processing','shipped','refunded') NOT NULL DEFAULT 'paid',
      source ENUM('seed','stripe') NOT NULL DEFAULT 'stripe',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(64) NOT NULL,
      product_id VARCHAR(64) NULL,
      name VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      INDEX (order_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Key-value store for editable homepage sections (hero slides, value
  // props, trust strip, community teaser) — one JSON blob per key.
  await db.query(`
    CREATE TABLE IF NOT EXISTS content_blocks (
      block_key VARCHAR(64) PRIMARY KEY,
      data JSON NOT NULL,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Uploaded images (logo, favicon, product/category photos) stored as
  // blobs in the same database — served back out via /api/media/[id].
  await db.query(`
    CREATE TABLE IF NOT EXISTS media (
      id VARCHAR(36) PRIMARY KEY,
      mime_type VARCHAR(100) NOT NULL,
      data LONGBLOB NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Idempotent column additions for databases created before these fields
  // existed — CREATE TABLE IF NOT EXISTS above only helps on a fresh DB.
  await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL`);
  await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url_2 VARCHAR(500) NULL`);
  await db.query(`ALTER TABLE categories ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) NULL`);
  await db.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSON NULL`);

  // Admin accounts (replaces the single-credential Basic Auth login once a
  // database is connected) and their login sessions.
  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id VARCHAR(36) PRIMARY KEY,
      username VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS admin_sessions (
      token VARCHAR(64) PRIMARY KEY,
      user_id VARCHAR(36) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // Payment provider credentials, entered from Admin → Payments instead of
  // hosting env vars. Secret fields are encrypted before they land here —
  // see src/lib/secrets.ts. A single fixed-id row since there's one store.
  await db.query(`
    CREATE TABLE IF NOT EXISTS payment_credentials (
      id TINYINT PRIMARY KEY,
      stripe_secret_key TEXT NULL,
      stripe_webhook_secret TEXT NULL,
      paypal_client_id VARCHAR(255) NULL,
      paypal_client_secret TEXT NULL,
      paypal_mode VARCHAR(16) NOT NULL DEFAULT 'sandbox'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  // First-run bootstrap: seed one admin account from the env-var
  // credentials so a fresh database doesn't lock you out. Once this row
  // exists, ADMIN_USER/ADMIN_PASSWORD are no longer read for login —
  // manage accounts from Admin → Users instead.
  const [countRows] = await db.query(`SELECT COUNT(*) as count FROM admin_users`);
  const userCount = (countRows as { count: number }[])[0].count;
  if (userCount === 0 && process.env.ADMIN_USER && process.env.ADMIN_PASSWORD) {
    await db.query(`INSERT INTO admin_users (id, username, password_hash) VALUES (?, ?, ?)`, [
      generateId(),
      process.env.ADMIN_USER,
      hashPassword(process.env.ADMIN_PASSWORD),
    ]);
  }
}

/** Ensures schema exists, memoized so it only runs once per server process. */
export function ready(): Promise<void> {
  if (!schemaReady) schemaReady = migrate();
  return schemaReady;
}

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
  await ready();
  const [rows] = await getPool().query(sql, params);
  return rows as T;
}
