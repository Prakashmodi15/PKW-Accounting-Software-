-- file: schema.sql

CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  start_period TEXT,
  end_period TEXT,
  current_date TEXT,
  last_entry_date TEXT
);

CREATE TABLE IF NOT EXISTS vouchers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_id INTEGER,
  date TEXT,
  type TEXT,
  account_debit TEXT,
  account_credit TEXT,
  amount REAL,
  narration TEXT,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
