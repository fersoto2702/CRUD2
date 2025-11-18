/* database.js */
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) console.error("Error al conectar SQLite:", err);
  else console.log("Conectado a SQLite");
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS telefonos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      precio REAL NOT NULL,
      stock INTEGER NOT NULL,
      descripcion TEXT
    )
  `);
});

module.exports = db;