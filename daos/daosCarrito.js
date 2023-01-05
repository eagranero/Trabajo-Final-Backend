import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";
import Contenedor_FS from "./fs/Contenedor_FS.js";
import { SchemaCarrito } from "./mongo/models/Schemas.js";
import logger from "../utils/logger.js";
import  fs  from 'fs'


export default class CarritosFactoryDAO {
    constructor(tipo,nombre){
        switch (tipo) {
            case "FILE":
                return new DaosCarritoFS(nombre);
            case "MONGO":
                connectMG("carritos");
                return new DaosCarritoMongo("carritos",SchemaCarrito)
            default:
                connectMG("carritos");
                return new DaosCarritoMongo("carritos",SchemaCarrito);
        }
    }
}

export class DaosCarritoFS extends Contenedor_FS{
    constructor(nombre,schema){
        super(nombre,schema)
    }

    async borrarElementosCarrito(idCarrito){
        try{
            this.getAll()
            for(let i=0;i<this.listado.length;++i){
                if (this.listado[i]._id==idCarrito){
                    this.listado[i].productos=[]
                    fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                    break
                }
            }
        }
        catch{
            logger.error("No se pudieron borrar los elementos del carrito")
        }

    }

    agregarAlCarrito(idCarrito,producto)
    { 
        let i=0;
        try{
            this.getAll()
            let idEncontrado=-1;
            for(i=0; i<this.listado.length;++i)
            {
                if (this.listado[i]._id==idCarrito){
                    idEncontrado=i;
                    break;
                }
            }
            if (idEncontrado>-1){
                this.listado[idEncontrado].productos.push(producto);
                fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                return true 
            }
            else {
                logger.info("No se encontro el carrito")
                return false
            }            
        }
        catch(e){
            console.log(e)
            logger.error("No se pudo guardar el archivo "+this.nombre)
        }
    }


    quitarDelCarrito(idCarrito,idProducto){
        let i=0;
        try{
            this.getAll()
            let indiceCarritoEncontrado=-1,indiceProductoEncontrado=-1;
            //Busco  del indice del carrito
            for(i=0; i<this.listado.length;++i)
            {
                //Si lo encuentro lo guardo y salgo del for
                if (this.listado[i]._id==idCarrito){
                    indiceCarritoEncontrado=i;
                    break;
                }
            }
            //Si encuentro el indice del carrito busco el indice del producto
            if (indiceCarritoEncontrado>-1){
                for(i=0; i<this.listado[indiceCarritoEncontrado].productos.length;++i){
                    //Si lo encuentro el dindice del producto lo guardo y salgo del for
                    if (this.listado[indiceCarritoEncontrado].productos[i]._id==idProducto){
                        indiceProductoEncontrado=i;
                        break;
                    }
                }
                //Si encontre el indice del producto lo borro y guardo el archivo
                if(indiceProductoEncontrado>-1){
                    this.listado[indiceCarritoEncontrado].productos.splice(indiceProductoEncontrado,1)
                    fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                    return 0
                }
                else{ //si no encuentro el producto
                    logger.info("No se encontro el producto")
                    return 1
                } 
            }
            else{ //si no encuentro el carrito
                logger.info("No se encontro el carrito")
                return 2
            }            
        }
        catch(err){
            logger.error("No se pudo guardar el archivo "+this.nombre)
            return 3
        } 
    }
}

export class DaosCarritoMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }

    async agregarAlCarrito(idCarrito,producto){
        try{
            let respuesta = await this.collectionElement.findByIdAndUpdate(idCarrito,{$push:{"productos":producto}})
            if (respuesta==null) {
                logger.info("Carrito no encontrado")
                return 0
            }
            else{
                logger.info("Producto id:"+producto._id.toString()+" agregado al carrito id:"+idCarrito)
                return 1
            } 
        }catch(e) {
            console.log(e);
            logger.error("Error al intentar agregar al carrito")
            return -1
        }
    }

    async borrarElementosCarrito(idCarrito){
        await this.collectionElement.findByIdAndUpdate(idCarrito,{"productos":[]})
    }

    async quitarDelCarrito(idCarrito,idProducto){
        try{
            let carrito=await this.getById(idCarrito) //Obtengo carrito
            let producto = null;
            if(carrito!=null){
                let array=[...carrito.productos] //bajo todos los productos del carrito
                
                //Busco entre los productos bajados el que tenga el idProducto
                for(let i=0;i<array.length;++i){ 
                    if(array[i]._id.toString()==idProducto){
                        array.splice(i,1)
                        //actualizo carrito en mongo
                        producto = await this.collectionElement.findByIdAndUpdate(idCarrito,{"productos":array})
                        logger.info("Producto id:"+idProducto+" quitado del carrito id:"+idCarrito)
                        return 1
                    }
                }
                logger.info("producto no encontrado")
                return 2 //producto no encontrado
            }else{
                logger.info("carrito no encontrado")
                return 0 //carrito no encontrado
            }
        }catch(e) {
            console.log(e);
            logger.error("Error al intentar quitar del carrito")
            return -1
        }
    }
}





