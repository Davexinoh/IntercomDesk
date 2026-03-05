"use strict";

const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = process.env.SQLITE_PATH || path.join(__dirname, "intercomdesk.sqlite");
const db = new sqlite3.Database(DB_PATH);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ changes: this.changes, lastID: this.lastID });
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

async function init() {
  await run(`PRAGMA journal_mode=WAL;`);
  await run(`PRAGMA foreign_keys=ON;`);

  await run(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS category_issues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id TEXT NOT NULL,
      issue TEXT NOT NULL,
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL,
      sub_issue TEXT NOT NULL,
      priority TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      admin_reply TEXT DEFAULT "",
      internal_note TEXT DEFAULT "",
      assigned_to TEXT DEFAULT "",
      tags TEXT DEFAULT "",
      FOREIGN KEY(category_id) REFERENCES categories(id)
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS timeline (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL,
      event TEXT NOT NULL,
      at INTEGER NOT NULL,
      FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL,
      sender TEXT NOT NULL, -- 'user' | 'admin'
      body TEXT NOT NULL,
      at INTEGER NOT NULL,
      FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS attachments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id TEXT NOT NULL,
      name TEXT NOT NULL,
      mime TEXT NOT NULL,
      data_url TEXT NOT NULL,
      at INTEGER NOT NULL,
      FOREIGN KEY(ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
    );
  `);

  // Seed categories if empty
  const count = await get(`SELECT COUNT(*) AS c FROM categories;`);
  if (!count || count.c === 0) {
    const seed = [
      { id: "payment", name: "Payment Issues", issues: ["failed_transaction", "refund_request", "charged_twice"] },
      { id: "login", name: "Login Problems", issues: ["reset_password", "cant_login", "2fa_issue"] },
      { id: "bug", name: "Bug Report", issues: ["ui_bug", "system_error", "crash"] },
      { id: "other", name: "Other", issues: ["general", "feedback"] }
    ];

    for (const c of seed) {
      await run(`INSERT INTO categories (id, name) VALUES (?, ?);`, [c.id, c.name]);
      for (const issue of c.issues) {
        await run(`INSERT INTO category_issues (category_id, issue) VALUES (?, ?);`, [c.id, issue]);
      }
    }
  }
}

module.exports = { db, run, get, all, init };
