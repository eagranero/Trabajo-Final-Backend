import Contenedor_FS from "./fs/Contenedor_FS.js";
import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";
import { SchemaChat } from "./mongo/models/Schemas.js";


export default class ChatFactoryDAO {
    constructor(tipo,nombre){
        switch (tipo) {
            case "FILE":
                return new DaosChatFS(nombre);
            case "MONGO":
                connectMG("Chat");
                return new DaosChatMongo("Chat",SchemaChat)
            default:
                connectMG("Chat");
                return new DaosChatMongo("Chat",SchemaChat);
        }
    }
}



class DaosChatMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }
}
 
class DaosChatFS extends Contenedor_FS{
    constructor(nombre){
        super(nombre)
    }
    buscarTodos(elemento){
        try{
            let array=[]
            this.getAll()
            for(let i=0;i<this.listado.length;++i){
                if(this.listado[i].email==elemento.email){
                    array.push(this.listado[i])
                }
            }
            return array
        }
        catch (err){
            logger.error("No se pudieron obtener los productos")
            return []
        }  
    }
}



