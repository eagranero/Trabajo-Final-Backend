import Contenedor_Mongo, { connectMG } from "./mongo/Contenedor_Mongo.js";


connectMG("carritos");

export class DaosCarritoMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }

    async agregarAlCarrito(idCarrito,producto){
        try{
            let respuesta = await this.collectionElement.findByIdAndUpdate(idCarrito,{$push:{"productos":producto}})
            if (respuesta==null) {
                console.log("Carrito no encontrado")
                return 0
            }
            else{
                console.log("Producto id:"+producto._id.toString()+" agregado al carrito id:"+idCarrito)
                return 1
            } 
        }catch(e) {
            console.log(e);
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
                        console.log("Producto id:"+idProducto+" quitado del carrito id:"+idCarrito)
                        return 1
                    }
                }
                console.log("producto no encontrado")
                return 2 //producto no encontrado
            }else{
                console.log("carrito no encontrado")
                return 0 //carrito no encontrado
            }
        }catch(e) {
            console.log(e);
            return -1
        }
    }
}

