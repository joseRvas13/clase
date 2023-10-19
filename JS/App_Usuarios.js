import { User } from "./Clases_Usuarios.js";

const cuerpoTabla = document.querySelector("#cuerpo-tabla");
const myModal = new bootstrap.Modal(document.getElementById("modalUsuario"));
const mensajeActualizarDiv = document.querySelector("#mensajeActualizar");
const mensajeDiv = document.querySelector("#mensaje");
const mensajeEliminarDiv = document.querySelector("#mensajeEliminar");
const busqueda = document.querySelector("#busqueda");

let idUsuarioUpdate = null;

const mostrarMensaje = (mensaje, tipo, div) => {
  div.textContent = mensaje;

  const clases = {
    success: 'alert alert-success',
    update: 'alert alert-warning',
    error: 'alert alert-danger'
  };

  div.className = clases[tipo];
  div.style.display = 'block';

  setTimeout(() => {
    div.style.display = 'none';
  }, 4000);
};

const cargarDatosDesdeLocalStorage = () => {
  const datosGuardados = localStorage.getItem("usuariosData");
  if (datosGuardados) {
    return JSON.parse(datosGuardados);
  }
  return [];
};

const guardarDatosEnLocalStorage = (datos) => {
  localStorage.setItem("usuariosData", JSON.stringify(datos));
};

let datos = cargarDatosDesdeLocalStorage();

const agregarUsuario = (event) => {
  event.preventDefault();
  const id = datos.length > 0 ? datos[datos.length - 1].id + 1 : 1;
  const nombre = document.querySelector("#nombre").value;
  const email = document.querySelector("#email").value;
  const contrasena = document.querySelector("#contrasena").value;
  const nuevoUsuario = new User(id, nombre, email, contrasena);
  datos.push(nuevoUsuario);
  guardarDatosEnLocalStorage(datos);
  document.querySelector("#formUsuario").reset();
  cargarTabla();
  mostrarMensaje(`Usuario "${nuevoUsuario.nombre}" registrado con éxito`, "success", mensajeDiv);
};

window.mostrarModal = (id) => {
  idUsuarioUpdate = id;
  const index = datos.findIndex((item) => item.id === idUsuarioUpdate);
  const modalNombre = document.querySelector("#nombreModal");
  const modalEmail = document.querySelector("#emailModal");
  const modalContrasena = document.querySelector("#contrasenaModal");
  modalNombre.value = datos[index].nombre;
  modalEmail.value = datos[index].email;
  modalContrasena.value = datos[index].contrasena;
  myModal.show();
};

const usuarioUpdate = (e) => {
  e.preventDefault();
  const index = datos.findIndex((item) => item.id === idUsuarioUpdate);
  datos[index].nombre = document.querySelector("#nombreModal").value;
  datos[index].email = document.querySelector("#emailModal").value;
  datos[index].contrasena = document.querySelector("#contrasenaModal").value;
  guardarDatosEnLocalStorage(datos);
  cargarTabla();
  myModal.hide();
  mostrarMensaje(`Usuario "${datos[index].nombre}" actualizado`, "update", mensajeActualizarDiv);
};

window.borrarUsuario = (id) => {
  const index = datos.findIndex((item) => item.id === id);
  const userName = datos[index].nombre;
  const confirmar = confirm(`¿Está seguro/a de que desea eliminar el usuario "${userName}"?`);
  if (confirmar) {
    datos.splice(index, 1);
    guardarDatosEnLocalStorage(datos);
    cargarTabla();
    mostrarMensaje(`Usuario "${userName}" eliminado`, 'error', mensajeEliminarDiv);
  }
};

busqueda.addEventListener("input", () => {
    const filtro = busqueda.value.toLowerCase();
    const filas = cuerpoTabla.querySelectorAll("tr");
    filas.forEach((fila) => {
      const nombre = fila.querySelector("th").textContent.toLowerCase();
      const email = fila.querySelector("td").textContent.toLowerCase();
      if (nombre.includes(filtro) || email.includes(filtro)) {
        fila.style.display = "table-row";
      } else {
        fila.style.display = "none";
      }
    });
  });
  
const cargarTabla = () => {
  cuerpoTabla.innerHTML = "";
  datos.forEach((item) => {
    const fila = document.createElement("tr");
    const celdas = `
        <th>${item.nombre}</th>
        <td>${item.email}</td>
        <td>
            <div class="d-flex gap-2">
                <button class="btn btn-outline-warning" onclick="mostrarModal(${item.id})">
                    <i class="fa fa-pencil" aria-hidden="true"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="borrarUsuario(${item.id})">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
        </td>
    `;
    fila.innerHTML = celdas;
    cuerpoTabla.appendChild(fila);
  });
};

document.querySelector("#formUsuario").addEventListener("submit", agregarUsuario);
document.querySelector("#formModal").addEventListener("submit", usuarioUpdate);

cargarTabla();
