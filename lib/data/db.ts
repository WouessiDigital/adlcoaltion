import path from "path";
import fs from "fs";

let dbInstance: any = null;

export function getDb() {
  if (dbInstance) return dbInstance;
  // require inside function to defer native binding load
  // and ensure it only happens at runtime in node
  const Database = require("better-sqlite3");
  const isProd = process.env.NODE_ENV === "production";
  const dbPath = isProd
    ? "/data/members.db"
    : path.join(process.cwd(), "lib/data/members.db");
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  dbInstance = new Database(dbPath);
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      datecreated TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  return dbInstance;
}
