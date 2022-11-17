import express, { json } from "express";
import Contenedor_FS from "../daos/fs/Contenedor_FS.js";
import { SchemaProducto } from "../daos/mongo/models/Schemas.js";
import { DaosProductoMongo } from "../daos/daosProducto.js";
import { carritos, usuarios } from "./login.js";
import { nuevaCompraMail } from "../utils/mail.js";
import { wspCompraExitosa, wspNuevaCompra } from "../utils/wsp.js";
import { smsCompraExitosa } from "../utils/sms.js";


export const listadoProductos =  new DaosProductoMongo("productos",SchemaProducto)
export const listadoChat= new Contenedor_FS("chat")
export const routerCarrito = express.Router()


function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  }
  

//Direccion para cargar la pagina principal
routerCarrito.get('/',checkAuthentication, async (req, res) => {
    let login=req.session.user
    let user=await usuarios.buscar({username:login})
    let carrito= await carritos.getById(user.carritoId)
    let items=carrito.productos
    let usuario= await usuarios.buscar({username:login})
    let foto="/perfiles/"+usuario.foto
    res.render('carrito',{login,items,foto});
});

//Direccion para borrar todos los productos de la base de datos
routerCarrito.get('/borrarcarrito',checkAuthentication, async (req, res) => {
    await carritos.deleteAll()
    res.redirect("/api/carrito")
});

routerCarrito.post('/comprar',checkAuthentication, async (req, res) => {
  console.log("comprado")
  let user=await usuarios.buscar({username:req.session.user})
  let carrito = await carritos.getById(user.carritoId)
  nuevaCompraMail(user,carrito.productos)
  wspNuevaCompra(user,carrito.productos) //whatsapp al admin por compra nueva
  //wspCompraExitosa(user.telefono) //whatsapp de compra exitosa
  smsCompraExitosa(user.telefono) //SMS de compra exitosa
  await carritos.borrarElementosCarrito(user.carritoId)
  res.redirect("/api/carrito")
});

routerCarrito.post('/agregaritem/:id',checkAuthentication,async (req,res)=>{
  const {id} = req.params;
  let user=await usuarios.buscar({username:req.session.user})
  let producto = await listadoProductos.getById(id)
  carritos.agregarAlCarrito(user.carritoId,producto)
  res.redirect("/api/carrito")
})

routerCarrito.post('/quitaritem/:id',checkAuthentication,async (req,res)=>{
  const {id} = req.params;
  let user=await usuarios.buscar({username:req.session.user})
  carritos.quitarDelCarrito(user.carritoId,id)
  res.redirect("/api/carrito")
})







