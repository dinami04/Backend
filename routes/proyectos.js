const express = require("express");
const router = express.Router();
const db = require("../db");

// POST /proyectos
// GET /proyectos
router.get("/", (req, res) => {
  db.query("SELECT * FROM proyectos", (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { id_artista, nombre_proyecto, descripcion } = req.body;

  // Validaciones
  if (!id_artista || !nombre_proyecto) {
    return res.status(400).json({
      error: "id_artista y nombre_proyecto son obligatorios",
    });
  }

  const sql = `
    INSERT INTO proyectos (id_artista, nombre_proyecto, descripcion)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [id_artista, nombre_proyecto, descripcion || null],
    (err, result) => {
      if (err) {
        // Error típico si el id_artista no existe (FOREIGN KEY)
        if (err.code === "ER_NO_REFERENCED_ROW_2") {
          return res.status(400).json({
            error: "El id_artista no existe",
          });
        }
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Proyecto creado",
        id_proyecto: result.insertId,
      });
    },
  );
});

module.exports = router;
