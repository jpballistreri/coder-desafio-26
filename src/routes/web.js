import express from "express";
import fs from "fs";
import { DBProductos } from "../services/db";
import { FakerService } from "../services/faker";
import path from "path";
import passport from "../../middlewares/auth";
import { Console } from "console";
import { isLoggedIn } from "../../middlewares/auth";

const router = express.Router();
//const publicPath = path.resolve(__dirname, "../../public");

router.get("/", (req, res) => {
  if (req.isAuthenticated) {
    res.redirect("/productos/login");
  } else {
    res.redirect("/productos/vista");
  }
});

router.get("/login", async (req, res) => {
  if (req.isAuthenticated()) res.redirect("/productos/vista");
  else {
    res.render("login");
  }
});

router.get("/signup", async (req, res) => {
  res.render("signup");
});

router.get("/error-login", async (req, res) => {
  res.render("error-login");
});

router.get("/error-signup", async (req, res) => {
  res.render("error-signup");
});

router.get("/ok-signup", async (req, res) => {
  res.render("ok-signup");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/productos/login");
});

router.get("/vista", isLoggedIn, async (req, res) => {
  req.session.contador++;
  const username = req.user.username;
  res.render("main", { username });
});

router.get("/ingreso", isLoggedIn, async (req, res) => {
  const username = req.user.username;
  res.render("ingreso", { username });
});

router.get("/vista-test", (req, res) => {
  const cantidad = req.query.cant ? Number(req.query.cant) : 10;
  const arrayProductos = FakerService.generar(cantidad);

  res.render("vista-test", { arrayProductos: arrayProductos });
});

export default router;
