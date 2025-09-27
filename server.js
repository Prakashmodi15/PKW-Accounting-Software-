import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Database open
let db;
(async () => {
  db = await open({
    filename: "./tally.db",
    driver: sqlite3.Database,
  });

  // Run schema
  await db.exec(`
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_period TEXT,
      end_period TEXT,
      current_date TEXT,
      last_entry_date TEXT
    );
  `);

  await db.exec(`
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
  `);
})();

// Routes
app.get("/companies", async (req, res) => {
  const rows = await db.all("SELECT * FROM companies");
  res.json(rows);
});

app.post("/companies", async (req, res) => {
  const { name, start_period, end_period, current_date, last_entry_date } = req.body;
  await db.run(
    "INSERT INTO companies (name, start_period, end_period, current_date, last_entry_date) VALUES (?,?,?,?,?)",
    [name, start_period, end_period, current_date, last_entry_date]
  );
  res.json({ message: "Company added!" });
});

app.get("/vouchers/:companyId", async (req, res) => {
  const rows = await db.all("SELECT * FROM vouchers WHERE company_id=?", [req.params.companyId]);
  res.json(rows);
});

app.post("/vouchers", async (req, res) => {
  const { company_id, date, type, account_debit, account_credit, amount, narration } = req.body;
  await db.run(
    "INSERT INTO vouchers (company_id, date, type, account_debit, account_credit, amount, narration) VALUES (?,?,?,?,?,?,?)",
    [company_id, date, type, account_debit, account_credit, amount, narration]
  );
  res.json({ message: "Voucher added!" });
});

app.listen(3000, () => console.log("✅ Server running at http://localhost:3000"));
