import Database from 'better-sqlite3'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.resolve(__dirname, '../salary.db')

export const db = new Database(DB_PATH)

db.exec(`
  CREATE TABLE IF NOT EXISTS monthly_records (
    year            INTEGER NOT NULL,
    month           INTEGER NOT NULL,
    salary_gross    INTEGER NOT NULL DEFAULT 0,
    salary_takehome INTEGER NOT NULL DEFAULT 0,
    bonus_gross     INTEGER NOT NULL DEFAULT 0,
    bonus_takehome  INTEGER NOT NULL DEFAULT 0,
    memo            TEXT NOT NULL DEFAULT '',
    PRIMARY KEY (year, month)
  )
`)
