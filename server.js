
import express from "express";
import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";
import {routerCarrito, carritos} from "./routers/carritos.js"
import {administrador, routerProductos, stock} from "./routers/productos.js"


//Esta funcion es para cear algunos productos y carrito para probar
const funcionSincronica = (async ()=>{
  await stock.deleteAll();
  await stock.save({nombre:"Producto 1",descrcipcion:"Descripcion 1",codigo:"codigo 1",foto:"foto 1",precio:100,stock:10});
  await stock.save({nombre:"Producto 2",descrcipcion:"Descripcion 2",codigo:"codigo 2",foto:"foto 2",precio:100,stock:10});
  await stock.save({nombre:"Producto 5",descrcipcion:"Descripcion 5",codigo:"codigo 5",foto:"foto 5",precio:100,stock:10});
  await stock.save({nombre:"Producto 3",descrcipcion:"Descripcion 3",codigo:"codigo 3",foto:"foto 3",precio:100,stock:10});
  await stock.save({nombre:"Producto 4",descrcipcion:"Descripcion 4",codigo:"codigo 4",foto:"foto 4",precio:100,stock:10});
  await carritos.deleteAll();
  await carritos.save({productos:[]})
})()



//Inicio Servidor Express---------------------------------------------------------------------
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8080

httpServer.listen(PORT,()=>{
    console.log("Servidor Encendido")
})

httpServer.on("error",(error)=>{console.log("Error en servidor")})

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use('/api/productos',routerProductos);
app.use('/api/carrito',routerCarrito);
app.use(cors());

//Ruta para cambiar el estado de la variable administrador
app.get('/administrador',(req, res) => {
  if (administrador) {
    administrador=false; 
    res.json({mensaje:"Vista Administrador desactivada"})}
  else {
    admin=true; 
    res.json({mensaje:"Vista Administrador activada"})}
  }
)