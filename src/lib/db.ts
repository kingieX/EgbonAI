import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Build the full path to the DB file
const dbPath = path.resolve(process.cwd(), "data/sentiments.db");

// Ensure the /data directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Connect to SQLite
const db = new Database(dbPath, {
  verbose: console.log,
});

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sentiment_results (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  text_content TEXT NOT NULL,
  sentiment TEXT NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

export default db;
