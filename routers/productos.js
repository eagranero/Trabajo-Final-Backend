import express, { json } from "express";
import Contenedor_FS from "../daos/fs/Contenedor_FS.js";
import { SchemaProducto } from "../daos/mongo/models/Schemas.js";
import { DaosProductoMongo } from "../daos/daosProducto.js";
import { usuarios } from "./login.js";


export const listadoProductos =  new DaosProductoMongo("productos",SchemaProducto)
export const listadoChat= new Contenedor_FS("chat")
export const routerProductos = express.Router()



function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  }
  

//Direccion para cargar la pagina principal
routerProductos.get('/',checkAuthentication, async (req, res) => {
    let login=req.session.user
    let usuario= await usuarios.buscar({username:login})
    let foto="/perfiles/"+usuario.foto
    res.render('productos',{login,foto});
});

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarproductos',checkAuthentication, async (req, res) => {
    await listadoProductos.deleteAll()
    res.redirect("/api/productos")
});

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarChat',checkAuthentication, async (req, res) => {
    await listadoChat.deleteAll()
    res.redirect("/api/productos")
});

