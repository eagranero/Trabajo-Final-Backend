import logger from "../utils/logger.js";
import Contenedor_FS from "./fs/Contenedor_FS.js";
import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";
import { SchemaOrdenes } from "./mongo/models/Schemas.js";


export default class OrdenesFactoryDAO {
    constructor(tipo,nombre){
        switch (tipo) {
            case "FILE":
                return new DaosOrdenesFS(nombre);
            case "MONGO":
                connectMG("Ordenes");
                return new DaosOrdenesMongo("Ordenes",SchemaOrdenes)
            default:
                connectMG("Ordenes");
                return new DaosOrdenesMongo("Ordenes",SchemaOrdenes);
        }
    }
}



class DaosOrdenesMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }

    save_orden =async (email,productos)=>{
        this.save({
            numeroDeOrden:await this.collectionElement.count(),
            email:email,
            estado:"Pedido",
            productos:productos
        })
    }

}

class DaosOrdenesFS extends Contenedor_FS{
    constructor(nombre){
        super(nombre)
    }
    save_orden =async (email,productos)=>{
        try{
            let numeroDeOrden
            this.getAll()
            if(this.listado.length>0){
                numeroDeOrden=this.listado[this.listado.length-1].numeroDeOrden+1
            }else numeroDeOrden=1
            this.save({
                numeroDeOrden:numeroDeOrden,
                email:email,
                estado:"Pedido",
                productos:productos
            })
        }
    catch{
        logger.error("No se pudo guardar la orden")
    }
    }
}



