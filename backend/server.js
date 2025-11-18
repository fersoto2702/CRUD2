/* server.js */
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./database");

const app = express();
const PORT = 4000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// =====================================
// GET: Obtener todos los teléfonos
// =====================================
app.get("/telefonos", (req, res) => {
  db.all("SELECT * FROM telefonos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// =====================================
// POST: Crear un teléfono
// =====================================
app.post("/telefonos", (req, res) => {
  const { marca, modelo, precio, stock, descripcion } = req.body;

  if (!marca || !modelo || !precio || !stock) {
    return res.status(400).json({ error: "Todos los campos obligatorios deben estar completos" });
  }

  const sql = `
    INSERT INTO telefonos (marca, modelo, precio, stock, descripcion)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(sql, [marca, modelo, precio, stock, descripcion], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    res.status(201).json({
      id: this.lastID,
      marca,
      modelo,
      precio,
      stock,
      descripcion
    });
  });
});

// =====================================
// PUT: Actualizar un teléfono
// =====================================
app.put("/telefonos/:id", (req, res) => {
  const { id } = req.params;
  const { marca, modelo, precio, stock, descripcion } = req.body;

  const sql = `
    UPDATE telefonos
    SET marca = ?, modelo = ?, precio = ?, stock = ?, descripcion = ?
    WHERE id = ?
  `;

  db.run(sql, [marca, modelo, precio, stock, descripcion, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "El teléfono no existe" });
    }

    res.json({
      id,
      marca,
      modelo,
      precio,
      stock,
      descripcion
    });
  });
});

// =====================================
// DELETE: Eliminar un teléfono
// =====================================
app.delete("/telefonos/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM telefonos WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ error: "El teléfono no existe" });
    }

    res.json({ success: true });
  });
});

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});