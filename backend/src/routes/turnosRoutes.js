const express = require("express");
const router = express.Router();
const { obtenerTurnos, crearTurnos} = require("../controllers/TurnosController");
router.get("/", obtenerTurnos);
router.post("/", crearTurnos);
module.exports = router;