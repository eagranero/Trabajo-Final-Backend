import express from "express";
import { agregarProductoController, borrarProductosController, initPorductosController, productoIdController, productosCategoriaController } from "../controllers/productos_controller.js";
import { checkAdmin, checkAuthentication } from "../utils/auth.js";
import { upload } from "../utils/upload.js";

export const routerProductos = express.Router()

//Direccion para cargar la pagina principal
routerProductos.get('/',checkAuthentication, initPorductosController);

//Direccion para borrar todos los productos de la base de datos
routerProductos.get('/borrarproductos',checkAuthentication,checkAdmin, borrarProductosController);


//Direccion para ingresar al formulario de ingreso de nuevo producto
routerProductos.get('/nuevoproducto',checkAuthentication,checkAdmin, async (req, res) => {
    res.render('agregar_producto');
})

//Direccion para subir producto nuevo
routerProductos.post('/nuevoproducto',checkAuthentication,checkAdmin, upload.single('thumbnail'), agregarProductoController);

//Direccion para mostrar productos por categoria
routerProductos.get('/categorias/:categoria',checkAuthentication, productosCategoriaController);

//Direccion para mostrar productos por categoria
routerProductos.get('/:id',checkAuthentication, productoIdController);



