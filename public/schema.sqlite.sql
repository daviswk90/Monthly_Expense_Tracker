-- Enable FK enforcement
PRAGMA foreign_keys = ON;

-- (Optional) schema version for future migrations
PRAGMA user_version = 1;

-- Categories a user can assign to transactions
CREATE TABLE IF NOT EXISTS categories (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name         TEXT    NOT NULL,
  type         TEXT    NOT NULL,              -- 'expense' | 'income'
  description  TEXT,
  UNIQUE(name, type),
  CHECK (type IN ('expense','income'))
);

-- One row per expense/income entry
-- amount_cents is signed: negative for refunds/adjustments
CREATE TABLE IF NOT EXISTS transactions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  date_iso      TEXT    NOT NULL,              -- 'YYYY-MM-DD' (UTC or local choice; be consistent)
  amount_cents  INTEGER NOT NULL,              -- store money as integer cents
  category_id   INTEGER NOT NULL,
  note          TEXT,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_txn_date      ON transactions(date_iso);
CREATE INDEX IF NOT EXISTS idx_txn_category  ON transactions(category_id);
CREATE INDEX IF NOT EXISTS idx_txn_date_cat  ON transactions(date_iso, category_id);

-- Seed a few common categories
INSERT OR IGNORE INTO categories (id, name, type, description) VALUES
  (1, 'Groceries', 'expense',  'Food from supermarkets'),
  (2, 'Rent',      'expense',  'Monthly housing'),
  (3, 'Transport', 'expense',  'Bus, train, gas'),
  (4, 'Dining',    'expense',  'Restaurants, coffee'),
  (5, 'Salary',    'income',   'Paycheck');

-- Example seed transactions (remove in production)
-- INSERT INTO transactions (date_iso, amount_cents, category_id, note) VALUES
--   ('2025-11-08', -4599, 1, 'Trader Joe''s'),
--   ('2025-11-08', -120000, 2, 'November rent'),
--   ('2025-11-08', 250000, 5, 'Nov salary');
