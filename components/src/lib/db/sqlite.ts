import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import { loadBytes, saveBytes } from "../storage/idb";

type SQL = SqlJsStatic;

let SQL: SQL | null = null;
let db: Database | null = null;

// simple debounce to avoid spamming saves
let saveTimer: number | undefined;
function scheduleSave() {
  if (saveTimer !== undefined) {
    clearTimeout(saveTimer);
  }
  saveTimer = window.setTimeout(async () => {
    if (!db) {
      return;
    }
    const bytes = db.export();
    await saveBytes(bytes);
  }, 400);
}

async function readSchemaText(): Promise<string> {
  const res = await fetch("/databases/schema.sqlite.sql"); // served statically
  return await res.text();
}

export async function initDatabase(): Promise<void> {
  if (db) {
    return;
  }
  if (!SQL) {
    SQL = await initSqlJs({
      locateFile: (f) =>
        `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.13.0/${f}`,
    });
  }

  const existing = await loadBytes();
  if (existing) {
    db = new SQL.Database(existing);
  } else {
    db = new SQL.Database();
    // enforce FKs; set version
    db.run("PRAGMA foreign_keys = ON;");
    db.run("PRAGMA user_version = 1;");
    // run schema
    const ddl = await readSchemaText();
    db.run(ddl);
    scheduleSave();
  }
}

export function getDB(): Database {
  if (!db) {
    throw new Error("DB not initialized. Call initDatabase() first.");
  }
  return db;
}

export function withTransaction(fn: () => void): void {
  const d = getDB();
  try {
    d.run("BEGIN IMMEDIATE;");
    fn();
    d.run("COMMIT;");
    scheduleSave();
  } catch (e) {
    d.run("ROLLBACK;");
    throw e;
  }
}

// Write helper that auto-saves after mutation
export function runWrite(
  sql: string,
  params: (number | string | null)[] = []
): void {
  const d = getDB();
  const stmt = d.prepare(sql);
  stmt.run(params);
  stmt.free();
  scheduleSave();
}

// Read helpers
export function all<T = any>(
  sql: string,
  params: (number | string | null)[] = []
): T[] {
  const d = getDB();
  const stmt = d.prepare(sql);
  stmt.bind(params);
  const rows: T[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as T;
    rows.push(row);
  }
  stmt.free();
  return rows;
}

export function one<T = any>(
  sql: string,
  params: (number | string | null)[] = []
): T | null {
  const list = all<T>(sql, params);
  return list.length ? list[0] : null;
}
