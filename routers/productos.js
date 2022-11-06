import express from "express";
import {SchemaProducto} from "../daos/models/Schemas.js";
import {DaosProductoMongo, DaosProductoFirebase} from "../daos/mainDaos.js"



//ACA SE PUEDE SELECCIONAR QUE BASE DE DATOS USAR PARA PRODUCTOS (una o la otra)

//export const stock = new DaosProductoMongo("productos",SchemaProducto)
export const stock = new DaosProductoFirebase("productos")

//------------------------------------------------------------------------------






export const routerProductos = express.Router();

//Variable Administrador. Se puede cambiar el estado entrando a la ruta http://localhost:8080/admin
export const administrador=true
///Direcciones para la ruta producto------------------------------------------------------
//Direccion para ver los productos
routerProductos.get('/',async (req, res) => {
    res.json(await stock.getAll());
  });
  
  //Muestro producto segun id
  routerProductos.get('/:id', async (req,res)=>{
    const {id} = req.params;
    const elemento = await stock.getById(id)
    if (elemento) res.json(elemento)
    else res.json({error:"Producto no encontrado"})
  })
  
  //Agrego nuevo producto. Actualizo archivo y respondo con el producto cargado y su ID
  routerProductos.post('/', 
  (req,res,next)=>{
    if (administrador) next();
    else res.end();
  }, 
  async (req,res)=>{
    const {body} = req;
    let respuesta=await stock.save({...body})
    res.json({mensaje:"Producto con ID:"+respuesta+ " agregado"}) 
  })
  
  //Actualizo producto segun ID
  routerProductos.put('/:id', 
  (req,res,next)=>{
    if (administrador) next();
    else res.end();
  },  
  async (req,res)=>{
    const {id} = req.params;
    const {body} = req;
    let respuesta;
  
    respuesta=await stock.updateById(id,{...body})
  
    switch (respuesta){
      case 0:
        res.json({mensaje:"Producto no encontrado"})
        break
      case 1:
        res.json({mensaje:"Producto Actualizado"})
        break
      case -1:
        res.json({error:"Ocurrio un error al actualizar el producto"})
        break
    }
  })
  
  //Elimino un producto en funcion de su id
  routerProductos.delete('/:id', 
   (req,res,next)=>{
    if (administrador) next();
    else res.end();
  },  
  async (req,res)=>{
    let respuesta;
    const {id} = req.params;
    respuesta = await stock.deleteById(id); //Elimino elemento y actualizo archivo. Segun respuesta envío mensaje
    //if(respuesta==null) res.json({error:"Producto no encontrado"})
    //else res.json({mensaje:"Producto eliminado"})
  
    switch (respuesta){
      case 0:
        res.json({mensaje:"Producto no encontrado"})
        break
      case 1:
        res.json({mensaje:"Producto eliminado"})
        break
      case -1:
        res.json({error:"Ocurrio un error al eliminar el producto"})
        break
    }
  
  })
  
  //--------------------------------------------------------------------------------
  