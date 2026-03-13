const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /agendas
router.get("/", (req, res) => {
  const sql = `
    SELECT 
      agendas.tipo,
      agendas.fecha,
      agendas.hora,
      proyectos.nombre_proyecto
    FROM agendas
    JOIN proyectos 
      ON agendas.id_proyecto = proyectos.id_proyecto
    ORDER BY agendas.fecha, agendas.hora
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// POST /agendas
router.post("/", (req, res) => {
  console.log("BODY RECIBIDO: ", req.body);
  const { nombre_proyecto, tipo, fecha, hora } = req.body;

  // Validaciones
  if (!nombre_proyecto || !tipo || !fecha || !hora) {
    return res.status(400).json({
      error: "id_proyecto, tipo, fecha y hora son obligatorios",
    });
  }

  const sql = `
    INSERT INTO agendas (nombre_proyecto, tipo, fecha, hora)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nombre_proyecto, tipo, fecha, hora], (err, result) => {
    if (err) {
      // Error típico si el proyecto no existe (FOREIGN KEY)
      if (err.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
          error: "El id_proyecto no existe",
        });
      }
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Agenda creada",
      id_agenda: result.insertId,
    });
  });
});

module.exports = router;
