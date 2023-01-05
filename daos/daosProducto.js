import logger from "../utils/logger.js";
import Contenedor_FS from "./fs/Contenedor_FS.js";
import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";
import { SchemaProducto } from "./mongo/models/Schemas.js";


export default class ProductosFactoryDAO {
    constructor(tipo,nombre){
        switch (tipo) {
            case "FILE":
                return new DaosProductoFS(nombre);
            case "MONGO":
                connectMG("Productos");
                return new DaosProductoMongo("productos",SchemaProducto)
            default:
                connectMG("Productos");
                return new DaosProductoMongo("productos",SchemaProducto);
        }
    }
}



class DaosProductoMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }
}

class DaosProductoFS extends Contenedor_FS{
    constructor(nombre){
        super(nombre)
    }
    
    buscarTodos(elemento){
        try{
            let array=[]
            this.getAll()
            for(let i=0;i<this.listado.length;++i){
                if(elemento._id && this.listado[i]._id==elemento._id)array.push(this.listado[i])
                else if (elemento.categoria && this.listado[i].categoria==elemento.categoria)array.push(this.listado[i])
            }
            return array
        }
        catch (err){
            logger.error("No se pudieron obtener los productos")
            return []
        }  
    }
}



