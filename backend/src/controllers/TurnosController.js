const { sql, getConnection } = require("../config/db");
async function probarConexion(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().query("SELECT 1 AS ok");
    res.json({ ok: true, mensaje: "Conexión correcta con SQL Server", resultado: resultado.recordset });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: "No se pudo conectar con SQL Server", error: error.message });
  }
}
async function obtenerTurnos(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().query(`
      SELECT Id AS id, Cliente AS cliente, Servicio AS servicio, Fecha AS fecha, Hora AS hora, Confirmado AS confirmado
      FROM Turnos
      ORDER BY Id DESC
    `);
    res.json(resultado.recordset);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener turnos", error: error.message });
  }
}
async function crearTurnos(req, res) {
  try {
    const { cliente, servicio, fecha, hora, confirmado } = req.body;
    if (!cliente || !servicio || !fecha || !hora || confirmado === undefined) {
      return res.status(400).json({ mensaje: "Debe completar todos los datos" });
    }
    const pool = await getConnection();
    const resultado = await pool.request()
      .input("cliente", sql.NVarChar(100), cliente)
      .input("servicio", sql.NVarChar(100), servicio)
      .input("fecha", sql.Date, fecha)
      .input("hora", sql.NVarChar(20), hora)
      .input("confirmado", sql.Bit, confirmado === true || confirmado === "true")
      .query(`
        INSERT INTO Turnos (Cliente, Servicio, Fecha, Hora, Confirmado)
        OUTPUT INSERTED.Id AS id, INSERTED.Cliente AS cliente, INSERTED.Servicio AS servicio,
               INSERTED.Fecha AS fecha, INSERTED.Hora AS hora, INSERTED.Confirmado AS confirmado
        VALUES (@cliente, @servicio, @fecha, @hora, @confirmado)
      `);
    res.status(201).json({ mensaje: "Turno guardado correctamente", turno: resultado.recordset[0] });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al guardar turno", error: error.message });
  }
}

    
module.exports = { probarConexion, obtenerTurnos, crearTurnos };