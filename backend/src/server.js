require("dotenv").config({ path: __dirname + "/.env" });

const express = require("express");
const cors = require("cors");

const turnosRoutes = require("./routes/turnosRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/turnos", turnosRoutes);

app.get("/", (req, res) => {
  res.send("API Turnos funcionando");
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});