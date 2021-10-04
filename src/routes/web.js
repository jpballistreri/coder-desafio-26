import express from "express";
import fs from "fs";
import { DBProductos } from "../services/db";
import { FakerService } from "../services/faker";
import path from "path";

const router = express.Router();
//const publicPath = path.resolve(__dirname, "../../public");

router.get("/", (req, res) => {
  if (req.session.loggedIn == true) {
    res.redirect("/productos/vista");
  } else {
    res.redirect("/productos/login");
  }
});

router.get("/login", async (req, res) => {
  if (req.session.username) {
    res.redirect("/productos/vista");
  } else {
    //res.sendFile(publicPath + "/login.html");
    res.render("login");
  }
});

router.post("/login", async (req, res) => {
  let { username } = req.body;

  if (username) {
    req.session.loggedIn = true;
    req.session.admin = true;
    req.session.username = username;
    res.redirect("/productos/");
  } else {
    res.redirect("/productos/login");
  }
});

const validateLogIn = (req, res, next) => {
  if (req.session.loggedIn) next();
  else res.render("login");
  //Agregar render con error de fin de session
};

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/productos/login");
});

router.get("/vista", validateLogIn, async (req, res) => {
  req.session.contador++;
  const username = req.session.username;
  res.render("main", { username });
});

router.get("/ingreso", validateLogIn, async (req, res) => {
  req.session.contador++;
  const username = req.session.username;
  res.render("ingreso", { username });
});

router.get("/vista-test", (req, res) => {
  const cantidad = req.query.cant ? Number(req.query.cant) : 10;
  const arrayProductos = FakerService.generar(cantidad);

  res.render("vista-test", { arrayProductos: arrayProductos });
});

export default router;
