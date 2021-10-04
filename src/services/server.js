import express from "express";
import path from "path";
import routerApi from "../routes/api.js";
import web from "../routes/web.js";
import MongoStore from "connect-mongo";
import { DBSesiones } from "./db";
import cookieParser from "cookie-parser";
import session from "express-session";

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

app.use(cookieParser());
app.use(session(DBSesiones));

app.use("/api", routerApi);
app.use("/productos", web);

export default myServer;
