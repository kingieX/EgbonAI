// src/lib/db.ts
import Database from "better-sqlite3";
import path from "path";

// Locate the SQLite file in the root or /data folder
const db = new Database(path.resolve(process.cwd(), "data/sentiments.db"), {
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    text_content TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

export default db;
