const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "cuartoarte_secret";

// ===============================
// 🔐 Middleware verificar token
// ===============================
function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

// ===============================
// 📥 GET EVENTOS
// ===============================
router.get("/", verificarToken, (req, res) => {
  const sql = `
    SELECT
      id_evento,
      titulo,
      fecha,
      lugar,
      descripcion
    FROM eventos
    ORDER BY fecha DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error al obtener eventos:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    res.json(rows);
  });
});

// ===============================
// ➕ POST CREAR EVENTO
// ===============================
router.post("/", verificarToken, (req, res) => {
  const { titulo, fecha, lugar, descripcion } = req.body;

  if (!titulo || !fecha) {
    return res.status(400).json({
      error: "Titulo y fecha son obligatorios",
    });
  }

  const sql = `
    INSERT INTO eventos (titulo, fecha, lugar, descripcion)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [titulo, fecha, lugar, descripcion], (err, result) => {
    if (err) {
      console.error("Error al crear evento:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    res.json({
      message: "Evento creado",
      id_evento: result.insertId,
    });
  });
});

module.exports = router;
