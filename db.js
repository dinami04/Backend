const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // XAMPP normalmente vacío
  database: "cuarto_arte",
  port: 3306,
});

module.exports = db;
