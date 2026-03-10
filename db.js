const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "metro.proxy.rlwy.net",
  user: "root",
  password: "jZMnbIRrcqsZluuXpUdwcUdgaZWPunWC",
  database: "railway",
  port: 15389,
});

module.exports = db;
