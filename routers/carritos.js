import express from "express";
import {SchemaCarrito} from "../daos/models/Schemas.js";
import { stock } from "./productos.js";
import {DaosCarritoMongo, DaosCarritoFirebase} from "../daos/mainDaos.js"



//ACA SE PUEDE SELECCIONAR QUE BASE DE DATOS USAR PARA CARRITOS (una o la otra)

//export const carritos = new DaosCarritoMongo("carritos",SchemaCarrito)
export const carritos = new DaosCarritoFirebase("carritos")

//-----------------------------------------------------------------------





export const routerCarrito = express.Router();

//Direcciones para las rutas carrito-------------------------------------------------------
//Direccion para ccrear un nuevo carrito
routerCarrito.post('/', async (req,res)=>{
    const idNuevoCarrito=await carritos.save({productos:[]})
    res.json({mensaje:"Carrito creado con el ID:"+idNuevoCarrito}) 
  })
  
  
  //Elimino un carrito en funcion de su id
  routerCarrito.delete('/:id', async (req,res)=>{
    let respuesta;
    const {id} = req.params;
    respuesta = await carritos.deleteById(id); //Elimino elemento y actualizo archivo. Segun respuesta envío mensaje
      
    switch (respuesta){
      case 0:
        res.json({mensaje:"Carrito no encontrado"})
        break
      case 1:
        res.json({mensaje:"Carrito eliminado"})
        break
      case -1:
        res.json({error:"Ocurrio un error al eliminar el carrito"})
        break
    }  
  })
  
  
  //Muestro carrito segun su ID
  routerCarrito.get('/:id/productos',async (req,res)=>{
    const {id} = req.params;
  
    let carrito= await carritos.getByID(id)
  
    if(carrito==null) res.json({error:"Carrito no encontrado"})
    else if (carrito == -1) res.json({error:"Ocurrio un error al buscar el carrito"})
    else res.json(carrito)
  })
  
  
  //Cargo producto en carrito segun su ID
  routerCarrito.post('/:idCarrito/productos', async (req,res)=>{
    const {idCarrito} = req.params;
    const {body} = req;
    let respuesta
    const producto = await stock.getById(body.idProducto)
  
    if (producto==null)res.json({error:"Producto no encontrado"})
    else if (producto==-1)res.json({error:"Error al agregar el producto"}) 
    else {
      respuesta=await carritos.agregarAlCarrito(idCarrito,producto)
      
      switch (respuesta){
        case 0:
          res.json({error:"Carrito no encontrado"})
          break
        case 1:
          res.json({mensaje:"Producto con ID:"+body.idProducto+" agregado en carrito con ID:"+idCarrito})
          break
        case -1:
          res.json({error:"Ocurrio un error al agregar al carrito"})
          break 
      }
    }
  })
  
  //Elimino Producto en funcion de ID de carrito e ID de Producto
  routerCarrito.delete('/:idCarrito/productos/:idProducto', async (req,res)=>{
    const {idCarrito,idProducto} = req.params;
    const respuesta = await carritos.quitarDelCarrito(idCarrito,idProducto)
  
    switch (respuesta){
      case 0:
        res.json({error:"Carrito no encontrado"})
        break
      case 1:
        res.json({error:"Producto con ID:"+idProducto+" eliminado del carrito con ID:"+idCarrito})
        break
      case 2:
        res.json({error:"Producto no encontrado"})
        break
      case -1:
        res.json({error:"Ocurrio un error al quitar producto del carrito"})
        break
    }
  })
  
 