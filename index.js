
import express from "express";
import cors from "cors"
import Productos, { itemProducto } from "./Productos.js";
import Carritos from "./Carritos.js";
import { createServer, get } from "http";
import { Server } from "socket.io";

//Variable Administrador. Se puede cambiar el estado entrando a la ruta http://localhost:8080/admin
let admin=true

const stock = new Productos("listadoProductos")
const carritos = new Carritos("listadoCarritos")

stock.getAll();
stock.deleteAll();
stock.save(new itemProducto("Producto 1","Descripcion 1","codigo 1","foto 1",100,10));
stock.save(new itemProducto("Producto 2","Descripcion 2","codigo 2","foto 2",100,10));
stock.save(new itemProducto("Producto 3","Descripcion 3","codigo 3","foto 3",100,10));
stock.save(new itemProducto("Producto 4","Descripcion 4","codigo 4","foto 4",100,10));
stock.save(new itemProducto("Producto 5","Descripcion 5","codigo 5","foto 5",100,10));

stock.deleteByID(3);
stock.getAll();

//Borro lo que habia antes en el carrito para arrancar de cero. Desactivar esta funcion para tener persistencia
carritos.borrarTodosLosCarritos()

carritos.crearCarrito()
carritos.crearCarrito()
carritos.crearCarrito()
carritos.crearCarrito()
carritos.crearCarrito()
carritos.crearCarrito()
carritos.agregarAlCarrito(2,stock.listado[stock.getByID(2)])
carritos.borrarCarrito(5)


//Inicio Servidor Express
const app = express();
const routerProductos = express.Router();
const routerCarrito = express.Router();


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
app.get('/admin',(req, res) => {
  if (admin) {
    admin=false; 
    res.json({mensaje:"Vista Administrador desactivada"})}
  else {
    admin=true; 
    res.json({mensaje:"Vista Administrador activada"})}
  }
)

///Direcciones para la ruta producto------------------------------------------------------
//Direccion para ver los productos
routerProductos.get('/',(req, res) => {
  res.json(stock.listado);
});

//Muestro producto segun id
routerProductos.get('/:id', (req,res)=>{
  const {id} = req.params;
  let elemento=stock.listado.find((item)=>item.id==id)
  if (elemento) res.json(elemento)
  else res.json({error:"Producto no encontrado"}) 
})

//Agrego nuevo producto. Actualizo archivo y respondo con el producto cargado y su ID
routerProductos.post('/', 
(req,res,next)=>{
  if (admin) next();
  else res.end();
}, 
(req,res)=>{
  const {body} = req;
  listadoProductos.save(body) //agrego producto al archivo
  res.json(stock.listado[stock.listado.length-1]) 
})

//Actualizo producto segun ID
routerProductos.put('/:id', 
(req,res,next)=>{
  if (admin) next();
  else res.end();
},  
(req,res)=>{
  const {id} = req.params;
  const {body} = req;
  let encontrado=false;
  for(let i=0; i<stock.listado.length;++i){ //Realizo barrido de busqueda en listado
    if (stock.listado[i].id==id){ //Busco elemento segun id
      encontrado=true; //Indico que lo encontre
      if(body.nombre)stock.listado[i].nombre=body.nombre; //si indico nombre lo cambio
      if(body.precio)stock.listado[i].precio=body.precio; //si indico precio lo cambio
      if(body.tumbnail)stock.listado[i].tumbnail=body.tumbnail; //si indico tumbnail lo cambio
      break; //Salgo del bucle
    }
  }
  if (encontrado==false) res.json({error:"Producto no encontrado"})
  else{
    stock.saveModificado(); //Actualizo el archivo
    res.json(stock.listado[stock.getByID(id)]) //Respondo con el elemento modificado
  }
})

//Elimino un producto en funcion de su id
routerProductos.delete('/:id', 
(req,res,next)=>{
  if (admin) next();
  else res.end();
},  
(req,res)=>{
  let respuesta;
  const {id} = req.params;
    respuesta = stock.deleteByID(id); //Elimino elemento y actualizo archivo. Segun respuesta envío mensaje
    if(respuesta==true) res.json({mensaje:"Elemento eliminado"})
    else if(respuesta==false) res.json({error:"Producto no encontrado"})
    else res.json({error:"Ocurrio un error al eliminar el elemento"})
})

//--------------------------------------------------------------------------------



//Direcciones para las rutas carrito-------------------------------------------------------
//Direccion para ccrear un nuevo carrito
routerCarrito.post('/', (req,res)=>{
  //const {body} = req;
  const idNuevoCarrito=carritos.crearCarrito()
  res.json({mensaje:"Carrito creado con el ID:"+idNuevoCarrito}) 
})


//Elimino un carrito en funcion de su id
routerCarrito.delete('/:id', (req,res)=>{
  let respuesta;
  const {id} = req.params;
    respuesta = carritos.borrarCarrito(id); //Elimino elemento y actualizo archivo. Segun respuesta envío mensaje
    if(respuesta==true) res.json({mensaje:"Elemento eliminado"})
    else if(respuesta==false) res.json({error:"Producto no encontrado"})
    else res.json({error:"Ocurrio un error al eliminar el elemento"})
})


//Muestro carrito segun su ID
routerCarrito.get('/:id/productos', (req,res)=>{
  const {id} = req.params;
  let elemento=carritos.listadoCarritos.find((item)=>item.idCarrito==id)
  if (elemento) res.json(elemento)
  else res.json({error:"Carrito no encontrado"}) 
})


//Cargo producto en carrito segun su ID
routerCarrito.post('/:idCarrito/productos', (req,res)=>{
  const {idCarrito} = req.params;
  const {body} = req;
  const indice = stock.getByID(body.idProducto)
  if (indice>-1){
    if (carritos.agregarAlCarrito(idCarrito,stock.listado[indice])==true) res.json({mensaje:"Producto con ID:"+body.idProducto+" agregado en carrito con ID:"+idCarrito})
    else res.json({error:"Carrito no encontrado"})
  }
  else if(indice==-1)res.json({error:"Producto no encontrado"})
  else if(indice==null)res.json({error:"No se pudo leer el archivo"})
})

//Elimino Producto en funcion de ID de carrito e ID de Producto
routerCarrito.delete('/:idCarrito/productos/:idProducto', (req,res)=>{
  const {idCarrito,idProducto} = req.params;
  const respuesta = carritos.quitarDelCarrito(idCarrito,idProducto)

  switch (respuesta){
    case 0:
      res.json({error:"Producto con ID:"+idProducto+" eliminado del carrito con ID:"+idCarrito})
    case 1:
      res.json({error:"Producto no encontrado"})
    case 2:
      res.json({error:"Carrito no encontrado"})
    case 3:
      res.json({error:"El archivo no pudo ser guardado"})
  }
})
