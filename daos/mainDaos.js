
import { DaosProductoMongo , DaosProductoFirebase } from "./daosProducto.js"
import { DaosCarritoMongo , DaosCarritoFirebase} from "./daosCarrito.js"
import {connectFB} from "./contenedores/Contenedor_Firebase.js"
import { connectMG } from "./contenedores/Contenedor_Mongo.js"

connectMG("ecommerce");
connectFB();

export {DaosProductoMongo, DaosCarritoMongo, DaosProductoFirebase, DaosCarritoFirebase}