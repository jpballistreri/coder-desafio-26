/////////////////////

////////////WEBSOCKETS
const socket = io.connect("http://localhost:8080", { forceNew: true });
// Cuando arrancamos pedimos la data que hay actualmente enviando un socket
socket.emit("get-productos");
socket.emit("get-mensajes");

function limpiarForms() {
  document.getElementById("titulo_producto").value = "";
  document.getElementById("precio_producto").value = "";
  document.getElementById("thumbnail").value = "";
  document.getElementById("mensajeEmail").value = "";
  document.getElementById("mensajeTexto").value = "";
}
//Limpia los formularios al cargar la pagina
window.onload = function () {
  limpiarForms();
};

function renderMensajes(data) {
  let html = data
    .map(function (elem, index) {
      return `<p>
              <span class="messageEmail">${elem.author.email}</span>  
              <span class="messageDate">${elem.timestamp}</span>
              <span class="messageText">${elem.text}</span>
              </p>`;
    })
    .join(" ");
  document.getElementById("mensajes").innerHTML = html;
}

function renderProductos(data) {
  console.log("rendereandoooo");
  data.reverse();

  let html = data
    .map(function (elem, index) {
      return `
                <tr>
                  <td>${elem.title}</td>
                  <td>${elem.price}</td>
                  <td><img src="${elem.thumbnail}"></td>
                </tr>
              
              `;
    })
    .join(" ");

  document.getElementById("productos").innerHTML = html;
}

socket.on("array-productos", (data) => {
  console.log("RECIBI LISTA");
  console.log(data);
  renderProductos(data);
});
socket.on("array-mensajes", (data) => {
  console.log("RECIBI MENSAJES");
  console.log(data);
  renderMensajes(data);
});
socket.on("mensaje-error", (res) => {
  alert(res.msj);
});

function enviarFormulario(e) {
  //e.preventDefault();
  let title = document.getElementById("titulo_producto").value;
  let price = Number(document.getElementById("precio_producto").value);
  let thumbnail = document.getElementById("thumbnail").value;
  //let mensaje = document.getElementById("msjIngresoProducto");

  fetch("/api/productos/", {
    method: "POST",
    body: JSON.stringify({ title, price, thumbnail }),
    headers: { "content-type": "application/json" },
  })
    .then((res) => res.json())
    .then((res) => (socket.emit("nuevo-producto"), alert(res.msj)));
  console.log(JSON.stringify({ title, price, thumbnail }));
}
/////////////////
///////////FORMULARIO INGRESO MENSAJE
function enviarMensaje(e) {
  e.preventDefault();
  let email = document.getElementById("mensajeEmail").value;
  let nombre = document.getElementById("nombreTexto").value;
  let apellido = document.getElementById("apellidoTexto").value;
  let edad = document.getElementById("edadTexto").value;
  let alias = document.getElementById("aliasTexto").value;
  let avatar = document.getElementById("avatarTexto").value;
  let mensaje = document.getElementById("mensajeTexto").value;
  socket.emit(
    "nuevo-mensaje",
    email,
    nombre,
    apellido,
    edad,
    alias,
    avatar,
    mensaje
  );
  document.getElementById("mensajeTexto").value = "";
}
