const express = require("express");
const router = express.Router();
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// GET PAGOS
// ==========================
router.get("/", authMiddleware, (req, res) => {
  const sql = `
    SELECT 
      p.id_pago,
      p.total,
      p.anticipo,
      (p.total - p.anticipo) AS restante,
      c.nombre
    FROM pagos p
    LEFT JOIN clientes c ON c.id_cliente = p.id_cliente
    ORDER BY p.id_pago DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error obtener pagos:", err);
      return res.status(500).json({ error: "Error al obtener pagos" });
    }

    res.json(results);
  });
});

// ==========================
// POST PAGOS
// ==========================
router.post("/", authMiddleware, (req, res) => {
  const id_cliente = parseInt(req.body.id_cliente);
  const total = parseFloat(req.body.total);
  const anticipo = parseFloat(req.body.anticipo);

  console.log("POST /pagos body:", req.body);

  // validación correcta
  if (
    id_cliente === undefined ||
    total === undefined ||
    anticipo === undefined
  ) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios",
    });
  }

  const sql = `
    INSERT INTO pagos (id_cliente, total, anticipo, restante)
    VALUES (?, ?, ?, ?)
  `;

  const restante = total - anticipo;
  db.query(sql, [id_cliente, total, anticipo, restante], (err, result) => {
    if (err) {
      console.error("Error insertar pago:", err);
      return res.status(500).json({
        error: "Error al guardar pago",
      });
    }

    res.json({
      message: "Pago guardado",
      id_pago: result.insertId,
    });
  });
});

module.exports = router;
