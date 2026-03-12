import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcryptjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )`);

  // Customers table - Updated with TC, Phone, Photo
  db.run(`CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    tc_id TEXT,
    photo_path TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, (err) => {
    if (!err) {
      // Add missing columns if table already existed
      db.run(`ALTER TABLE customers ADD COLUMN tc_id TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('Error adding tc_id column:', err.message);
        }
      });
      db.run(`ALTER TABLE customers ADD COLUMN photo_path TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.error('Error adding photo_path column:', err.message);
        }
      });
    }
  });

      FOREIGN KEY(customer_id) REFERENCES customers(id)
    )`);

    // Default User Seeding
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
      if (row?.count === 0) {
        bcrypt.hash('123', 10, (err, hash) => {
          db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hash, 'admin'], (err) => {
            if (!err) console.log('Admin user seeded.');
          });
        });
      }
    });
  });
});

export default db;
