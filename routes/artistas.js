const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {
  db.query("SELECT * FROM artistas", (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// POST /artistas
router.post("/", (req, res) => {
  const { nombre_artistico, genero, descripcion } = req.body;

  // Validación mínima
  if (!nombre_artistico) {
    return res.status(400).json({ error: "nombre_artistico es obligatorio" });
  }

  const sql = `
    INSERT INTO artistas (nombre_artistico, genero, descripcion)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [nombre_artistico, genero || null, descripcion || null],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.status(201).json({
        message: "Artista creado",
        id_artista: result.insertId,
      });
    },
  );
});

module.exports = router;
