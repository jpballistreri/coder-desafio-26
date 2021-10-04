import exp from "constants";
import socketIo from "socket.io";
import { DBProductos, DBMensajes } from "../services/db";
import moment from "moment";
//import myServer from "./server";

export const initWSServer = (server) => {
  const io = socketIo(server);

  io.on("connection", (socket) => {
    console.log("\n\nUn cliente se ha conectado");
    console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
    console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);

    socket.on("nuevo-producto", async () => {
      console.log("Nuevo Producto!");
      const productos = await DBProductos.get();
      io.emit("array-productos", productos);
    });

    socket.on(
      "nuevo-mensaje",
      async (email, nombre, apellido, edad, alias, avatar, mensaje) => {
        function validateEmail(email) {
          const re = /\S+@\S+\.\S+/;
          return re.test(email);
        }

        if (
          validateEmail(email) == false ||
          !nombre ||
          !apellido ||
          !edad ||
          !alias ||
          !avatar ||
          !mensaje
        ) {
          socket.emit("mensaje-error", {
            msj: "Por favor, ingrese un Email válido y complete todos los campos.",
          });
        } else {
          ////Guarda mensaje
          const nuevoMensaje = {
            author: {
              email: email,
              nombre: nombre,
              apellido: apellido,
              alias: alias,
              edad: edad,
              avatar: avatar,
            },
            text: mensaje,
            timestamp: moment().format(),
          };
          await DBMensajes.create(nuevoMensaje);
          const arrayMensajes = await DBMensajes.get();
          io.emit("array-mensajes", arrayMensajes);
        }
      }
    );

    socket.on("get-productos", async () => {
      const productos = await DBProductos.get();
      socket.emit("array-productos", productos);
    });

    socket.on("get-mensajes", async () => {
      const mensajes = await DBMensajes.get();
      socket.emit("array-mensajes", mensajes);
    });
  });
  return io;
};
