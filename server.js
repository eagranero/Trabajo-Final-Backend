import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import {engine} from "express-handlebars"
import { listadoProductos } from "./persistencia/productos_persistencia.js";
import {socket} from "./socket.js"
import session from "express-session"
import MongoStore from "connect-mongo";
import { routerLogin } from "./routers/login.js";
import compression from "compression"
import logger from "./utils/logger.js"
import { routerChat } from "./routers/chat.js";
import { routerCarrito } from "./routers/carrito.js";
import { routerInfoUser } from "./routers/infouser.js";
import { routerProductos } from "./routers/productos.js";
import config from "./config.js";
import passport from "passport";



console.log(config.TIPO_PERSISTENCIA)


//CODIGO PARA CARGAR 3 PRODUCTOS DE PRUEBA
/*
const asincronica=(async()=>{
  await listadoProductos.deleteAll()
  await listadoProductos.save({
    nombre:"Escuadra", 
    precio:123.45, 
    categoria:"libreria",
    descripcion:"Este producto es una escuadra verde", 
    thumbnail:"../thumbnail/escuadra.jpg"})
  await listadoProductos.save({
    nombre:"Calculadora", 
    precio:123.45, 
    categoria:"electronica",
    descripcion:"La mejor calculadora que tengo", 
    thumbnail:"../thumbnail/calculadora.jpg"})
  await listadoProductos.save({
    nombre:"Cuaderno", 
    precio:123.45,
    categoria:"libreria",
    descripcion:"Cuaderno de tapas duras y muchas hojas", 
    thumbnail:"../thumbnail/cuaderno.jpg"})
})()
*/


//Inicio Servidor Express
const app = express();
app.use(compression())
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.DATABASE_CONNECTION_STRING,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),

    secret: config.SECRET_MONGO,
    cookie: {maxAge: 100000},
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: './views/layouts',
        partialsDir: './views/partials',
    })
);


app.use(passport.initialize());
app.use(passport.session());
app.use(express.json())
app.use(express.urlencoded({extended:true}));
  
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = config.PORT || 8080
httpServer.listen(PORT,()=>{
  console.log("Servidor Encendido en puerto "+ PORT)
})

app.use(function(req,res,next){
  req.session._garbage = Date();
  req.session.touch();
  next()
})

app.use(function (req, res, next) {
  logger.info(req.method + " " + req.url);
  next();
});

app.use('/api/chat',routerChat)
app.use('/api/productos',routerProductos);
app.use('/api/carrito',routerCarrito)
app.use('/api/infouser',routerInfoUser);
app.use('/login',routerLogin);


app.get('/', async (req, res) => {
  if (req.session.user) res.redirect("/login")
  else res.redirect("/login")
});

app.get('*', (req, res)=>{
  res.status(404).send('sitio no encotrado');
});

socket(io)











