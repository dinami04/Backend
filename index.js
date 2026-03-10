const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Cuarto Arte funcionando 🚀");
});

app.use("/artistas", require("./routes/artistas"));
app.use("/proyectos", require("./routes/proyectos"));
app.use("/agendas", require("./routes/agendas"));
app.use("/eventos", require("./routes/eventos"));
app.use("/pagos", require("./routes/pagos"));
app.use("/clientes", require("./routes/clientes"));
app.use("/", require("./routes/auth"));

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
