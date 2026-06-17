const API_URL = "http://localhost:5500/api/turnos";
 
const formulario = document.querySelector("#formTurnos"); 
const cliente = document.querySelector("#cliente"); 
const servicio = document.querySelector("#servicio"); 
const fecha = document.querySelector("#fecha"); 
const hora = document.querySelector("#hora"); 
const confirmado = document.querySelector("#confirmado"); 
const listado = document.querySelector("#listadoTurnos"); 
const mensaje = document.querySelector("#mensaje"); 
const btnCargar = document.querySelector("#btnCargar"); 
const btnTodas = document.querySelector("#btnTodas"); 
const btnDisponibles = document.querySelector("#btnDisponibles"); 
const btnNoDisponibles = document.querySelector("#btnNoDisponibles"); 
 

let turnosActuales = []; 
 
async function cargarTurnos() { 
  try { 
    const respuesta = await fetch(API_URL); 
 
    if (!respuesta.ok) { 
      throw new Error("Error al obtener turnos."); 
    } 
 
    const turnos = await respuesta.json(); 
    turnosActuales = turnos; 
    mostrarTurnos(turnosActuales); 
 
  } catch (error) { 
    mensaje.textContent = "No se pudo conectar con la API."; 
    mensaje.className = "error"; 
    console.error(error); 
  } 
} 
 
function mostrarTurnos(turnos) { 
  listado.innerHTML = ""; 
 
  if (turnos.length === 0) { 
    listado.innerHTML = `<p class="sin-resultados">No hay turnos para 
mostrar.</p>`; 
    return; 
  } 
 
  turnos.forEach(turno => { 
    const textoConfirmado = turno.confirmado ? "Confirmado" : "No confirmado"; 
    const claseConfirmado = turno.confirmado ? "confirmado" : "no-confirmado"; 
 
    listado.innerHTML += ` 
      <div class="tarjeta"> 
        <h3>${turno.cliente}</h3> 
        <p><strong>Servicio:</strong> ${turno.servicio}</p> 
        <p><strong>Fecha:</strong> ${turno.fecha}</p> 
        <p><strong>Hora:</strong> ${turno.hora}</p> 
        <p class="${claseConfirmado}">${textoConfirmado}</p> 
      </div> 
    `; 
  }); 
} 
 
function mostrarTodas() { 
  mostrarTurnos(turnosActuales); 
  mensaje.textContent = "Mostrando todos los turnos."; 
  mensaje.className = "ok"; 
} 
 
function mostrarDisponibles() { 
  const turnosDisponibles = turnosActuales.filter(turno => 
turno.confirmado); 
  mostrarTurnos(turnosDisponibles); 
  mensaje.textContent = "Mostrando turnos disponibles."; 
  mensaje.className = "ok"; 
} 
 
function mostrarNoDisponibles() { 
  const turnosNoDisponibles = turnosActuales.filter(turno => 
!turno.confirmado); 
  mostrarTurnos(turnosNoDisponibles); 
  mensaje.textContent = "Mostrando turnos no disponibles."; 
  mensaje.className = "ok"; 
} 
 
async function guardarTurno(evento) { 
  evento.preventDefault(); 
 
  const nuevoTurno = { 
    cliente: cliente.value.trim(), 
    servicio: servicio.value.trim(), 
    fecha: fecha.value, 
    hora: hora.value, 
    confirmado: confirmado.value === "true" 
  }; 
 
  if (nuevoTurno.cliente === "" || nuevoTurno.servicio === "" || 
nuevoTurno.fecha === "" || nuevoTurno.hora === "") { 
    mensaje.textContent = "Debe completar todos los datos correctamente."; 
    mensaje.className = "error"; 
    return; 
  } 
 
  try { 
    const respuesta = await fetch(API_URL, { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(nuevoTurno) 
    }); 
 
    if (!respuesta.ok) { 
      throw new Error("Error al guardar"); 
    } 
 
    mensaje.textContent = "Turno guardado correctamente."; 
    mensaje.className = "ok"; 
    formulario.reset(); 
    cargarTurnos(); 
 
  } catch (error) { 
    mensaje.textContent = "Error al guardar el turno."; 
    mensaje.className = "error"; 
    console.error(error); 
  } 
} 
 
 
formulario.addEventListener("submit", guardarTurno); 
btnCargar.addEventListener("click", cargarTurnos); 
btnTodas.addEventListener("click", mostrarTodas); 
btnDisponibles.addEventListener("click", mostrarDisponibles); 
btnNoDisponibles.addEventListener("click", mostrarNoDisponibles); 
cargarTurnos();
