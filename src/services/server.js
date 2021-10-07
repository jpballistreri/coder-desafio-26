import express from "express";
import path from "path";
import routerApi from "../routes/api.js";
import web from "../routes/web.js";
//import MongoStore from "connect-mongo";
import { DBSesiones } from "./db";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "../../middlewares/auth";

import { DBService, DBMensajesSqlite } from "./db";
import * as http from "http";
import { initWSServer } from "./socket";
import Config from "../../config";

/** INICIALIZACION API con EXPRESS */
const app = express();
const publicPath = path.resolve(__dirname, "../../public");
app.use(express.static(publicPath));

app.set("view engine", "pug");
const viewsPath = path.resolve(__dirname, "../../views/");
app.set("views", viewsPath);

const myServer = http.Server(app);
myServer.on("error", (err) => {
  console.log("ERROR ATAJADO", err);
});

initWSServer(myServer);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//app.use(cookieParser());
app.use(session(DBSesiones));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  /** https://www.youtube.com/watch?v=fGrSmBk9v-4 */
  /**
   * Cuando un usario se loguea correctamente, passport va a crear dentro de req.session una key llamada
   * passport. El valor de esa key sera un objeto con la info del usuario.
   * Ese objeto solo va a tener la key user cuyo valor es el userId del usuario logueado
   * Esa info la completa la funcion passport.serializeUser
   * Ej:
   * {
   *  "cookie":{
   *    "originalMaxAge":null,
   *    "expires":null,
   *    "httpOnly":true,
   *    "path":"/"
   *  },
   *  "passport":{"user":"6158c9cb4d9971ee67417051"}}
   */

  console.log(`REQ.SESSION =>\n${JSON.stringify(req.session)}`);

  /** Por otro lado, cada vez que viene una request nueva, passport va a tomar la info que
   * esta en el campo req.session.passport.user y va a llamar a la funcion deserializeUser
   * pasandole esa info. Esta funcion lo que hace es buscar en la DB el user y la info
   * la guarda en req.user
   */
  console.log(`REQ.USER =>\n${JSON.stringify(req.user)}`);

  /**Passport ofrece este metodo para saber si un usuario esta autenticado o no. Devuelve true o false */
  console.log(`REQ.AUTHENTICATE =>\n${JSON.stringify(req.isAuthenticated())}`);

  next();
});

app.use("/api", routerApi);
app.use("/productos", web);

export default myServer;
