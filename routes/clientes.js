const express = require("express");
const router = express.Router();
const db = require("../db");
const verificarToken = require("../middleware/authMiddleware");

// =============================
// GET CLIENTES
// =============================
router.get("/", verificarToken, (req, res) => {
  console.log("📥 GET /clientes");

  const sql = `
SELECT id_cliente, nombre, telefono
FROM clientes
ORDER BY nombre ASC
`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("❌ Error al obtener clientes:", err);

      return res.status(500).json({
        error: "Error del servidor",
      });
    }

    console.log("✅ Clientes encontrados:", rows.length);

    res.json(rows);
  });
});

// =============================
// CREAR CLIENTE
// =============================
router.post("/", verificarToken, (req, res) => {
  const { nombre, telefono } = req.body;

  if (!nombre || !telefono) {
    return res.status(400).json({
      error: "Nombre y teléfono son obligatorios",
    });
  }

  const sql = `
INSERT INTO clientes (nombre, telefono)
VALUES (?, ?)
`;

  db.query(sql, [nombre, telefono], (err, result) => {
    if (err) {
      console.error("❌ Error creando cliente:", err);

      return res.status(500).json({
        error: "Error del servidor",
      });
    }

    res.json({
      message: "Cliente creado",
      id_cliente: result.insertId,
    });
  });
});

// =============================
// ACTUALIZAR CLIENTE
// =============================
router.put("/:id", verificarToken, (req, res) => {
  const { nombre, telefono } = req.body;

  const sql = `
UPDATE clientes
SET nombre = ?, telefono = ?
WHERE id_cliente = ?
`;

  db.query(sql, [nombre, telefono, req.params.id], (err) => {
    if (err) {
      console.error("❌ Error actualizando cliente:", err);

      return res.status(500).json({
        error: "Error del servidor",
      });
    }

    res.json({
      message: "Cliente actualizado",
    });
  });
});

// =============================
// ELIMINAR CLIENTE
// =============================
router.delete("/:id", verificarToken, (req, res) => {
  const sql = `
DELETE FROM clientes
WHERE id_cliente = ?
`;

  db.query(sql, [req.params.id], (err) => {
    if (err) {
      console.error("❌ Error eliminando cliente:", err);

      return res.status(500).json({
        error: "Error del servidor",
      });
    }

    res.json({
      message: "Cliente eliminado",
    });
  });
});

module.exports = router;
