import express from "express";
import { agregarItemCarritoController, borrarCarritoController, compraCarritoController, initCarritoController, quitarItemCarritoController } from "../controllers/carrito_controller.js";
import { checkAuthentication } from "../utils/auth.js";


export const routerCarrito = express.Router()

//Direccion para cargar la pagina principal
routerCarrito.get('/',checkAuthentication, initCarritoController);

//Direccion para borrar todos los productos de la base de datos
routerCarrito.post('/borrarcarrito',checkAuthentication, borrarCarritoController);

//Direccion para comprar
routerCarrito.post('/comprar',checkAuthentication, compraCarritoController);

//Direccion para agregar producto al carrito
routerCarrito.post('/agregaritem/:id',checkAuthentication, agregarItemCarritoController)

//Direccion para quitar producto del carrito
routerCarrito.post('/quitaritem/:id',checkAuthentication, quitarItemCarritoController)







