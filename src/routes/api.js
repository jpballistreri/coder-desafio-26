import express from "express";
import fs from "fs";
import { DBProductos } from "../services/db";
import { isLoggedIn } from "../../middlewares/auth";
import { FakerService } from "../services/faker";
import UserRouter from "./user";
import passport from "../../middlewares/auth";

const router = express.Router();

//Con este router.post funciona bien el logueo
router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/productos/vista",
    failureRedirect: "/productos/error-login",
  })
);

//Con este router.post no loguea pero funcionan bien los redirect de error
//router.post("/login", (req, res, next) => {
//  passport.authenticate("login", function (err, user, info) {
//    console.log(err, user, info);
//    if (err) {
//      return next(err);
//    }
//    if (!user) return res.redirect("/productos/error-login");
//    else {
//      return res.json({ redirect: "/productos/vista" });
//    }
//  })(req, res, next);
//});

router.post("/signup", (req, res, next) => {
  passport.authenticate("signup", function (err, user, info) {
    console.log(err, user, info);
    if (err) {
      return next(err);
    }
    if (!user) return res.redirect("/productos/error-signup");

    return res.redirect("/productos/ok-signup");
  })(req, res, next);
});

//router.use("/user", isLoggedIn, UserRouter);

router.get("/productos/", async (req, res) => {
  const items = await DBProductos.get();
  res.json({
    data: items,
  });
});

router.get("/productos/:id", async (req, res) => {
  const { id } = req.params;

  const result = await DBProductos.get(id);
  if (!result.length)
    return res.status(404).json({
      msgs: "Producto no encontrado!",
    });

  res.json({
    data: result,
  });
});

const validateLogIn = (req, res, next) => {
  if (req.session.loggedIn) next();
  else res.redirect("/productos/login");
};

router.post("/productos/", isLoggedIn, async (req, res) => {
  const { title, price, thumbnail } = req.body;
  //Validar datos ingresados
  if (
    !title ||
    !price ||
    !thumbnail ||
    typeof title != "string" ||
    typeof price != "number" ||
    typeof thumbnail != "string"
  ) {
    return res.status(400).json({
      msj: "Se deben ingresar Titulo(string), Precio(number) y Thumbnail(string) del producto.",
    });
  }
  const item = {
    title,
    price,
    thumbnail,
  };

  const newProduct = await DBProductos.create(item);
  //const newProduct = await DBProductos.get("productos", newId);
  res.json({
    msj: "Producto agregado.",
    data: newProduct,
  });
});

router.delete("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const productoAEliminar = await DBProductos.get(id);
  if (!productoAEliminar.length) {
    return res.status(400).json({
      msj: "No existe el producto.",
    });
  }

  await DBProductos.delete(id);

  res.json({
    Producto_eliminado: productoAEliminar,
  });
});

router.put("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, price, thumbnail } = req.body;
  if (
    !title ||
    !price ||
    !thumbnail ||
    typeof title != "string" ||
    typeof price != "number" ||
    typeof thumbnail != "string"
  ) {
    return res.status(400).json({
      msj: "Se deben ingresar Titulo(string), Precio(number) y Thumbnail(string) del producto.",
    });
  }

  const productoAActualizar = await DBProductos.get(id);
  if (!productoAActualizar.length) {
    return res.status(400).json({
      msj: "No existe el producto.",
    });
  }

  const item = {
    title,
    price,
    thumbnail,
  };

  await DBProductos.update(id, item);
  const productoActualizado = await DBProductos.get(id);
  //console.log(await productoActualizado);
  res.json({
    Producto_actualizado: productoActualizado,
  });
});

export default router;
