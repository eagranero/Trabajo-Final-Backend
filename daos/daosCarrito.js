import Contenedor_Mongo from "./contenedores/Contenedor_Mongo.js";
import Contenedor_Firebase from "./contenedores/Contenedor_Firebase.js"

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
                return 2 //producto no encontrado
            }else return 0 //carrito no encontrado
        }catch(e) {
            console.log(e);
            return -1
        }
    }
}

export class DaosCarritoFirebase extends Contenedor_Firebase{ 
    constructor(nombre){
        super(nombre)
    }

     async agregarAlCarrito(idCarrito,producto){

    try{

      //Verifico si el dato producto viene de Mongo y regularizo de ser necesario
      if(producto._doc){
        producto={...producto._doc}
        producto._id=producto._id.toString()
      }
      //--------------------------------------------------------------------------
      
      let carrito=await this.getById(idCarrito)
        if (carrito){
          carrito.productos.push(producto)
          this.updateById(idCarrito,carrito)
          return 1
      }
      else return 0
    }catch(e){
      console.log(e)
      return -1
    }

  }

  async quitarDelCarrito(idCarrito,idProducto){

    try{
      let carrito=await this.getById(idCarrito)
      if (carrito){
        let array=[...carrito.productos]
        //Busco entre los productos bajados el que tenga el idProducto
        for(let i=0;i<array.length;++i){ 
          if(array[i]._id==idProducto){
            array.splice(i,1)
            carrito.productos=[...array]
            await this.updateById(idCarrito,carrito)
            console.log("Producto id:"+idProducto+" quitado del carrito id:"+idCarrito)
            return 1
          }
        }
        return 2
      }else return 0
    }catch(e){
      console.log(e)
      return -1
    }

  }

}


