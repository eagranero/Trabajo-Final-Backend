import  fs  from 'fs'
import Productos, { itemProducto } from "./Productos.js";

class itemCarrito{
    constructor(){
        this.timeStamp=Date.now(),
        this.productos=[],
        this.idCarrito=0
    }
}

export default class Carritos{
    constructor(nombre){
        this.nombre=nombre+".txt"; 
        this.listadoCarritos=[];
        this.ultimoID=0;
    }
        
    borrarTodosLosCarritos(){
        try{
            fs.writeFileSync(this.nombre,JSON.stringify([]));
            this.listadoCarritos=[];
            this.ultimoID=0;
        }
        catch{
            console.log("No pudo guardarse el archivo");
        }
    }
    getAll(){
        let contenido;
        try{
            contenido = fs.readFileSync(this.nombre,'utf-8') || "[]";
            let listadoParce = JSON.parse(contenido) || [];
            this.listadoCarritos=listadoParce;
            this.ultimoID=this.listadoCarritos[this.listadoCarritos.length-1].idCarrito;
            return listadoParce
        }
        catch (err){
            console.log("El archivo no existe o se encuentra vacio");
        }   
    }

    crearCarrito(){
        try{
            this.getAll()
            const nuevoCarrito = new itemCarrito();
            nuevoCarrito.idCarrito=this.ultimoID+1;
            this.listadoCarritos.push(nuevoCarrito);
            this.ultimoID++;
            fs.writeFileSync(this.nombre,JSON.stringify(this.listadoCarritos));
            return this.ultimoID;
        }
        catch(err){
            console.log(err)
            console.log("No se pudo guardar el archivo")
            return -1
        } 
    }

    borrarCarrito(id){

        try{
            this.getAll()
            let indiceListadoBorrar=-1;
            for(let i=0;i<this.listadoCarritos.length;i++){
                if (this.listadoCarritos[i].idCarrito==id)
                {
                    indiceListadoBorrar=i;
                }
            }
            if(indiceListadoBorrar==-1){
                console.log("No se encuentra el indice");
                return false; //Retorno false si no se encontro indice
            }
            else{
                this.listadoCarritos.splice(indiceListadoBorrar,1)
                fs.writeFileSync(this.nombre,JSON.stringify(this.listadoCarritos))
                console.log("Elemento borrado")
                return true; //Retorno true si lo encontro y elimino correctamente
            } 
        }
        catch{
            console.log("No se pudo modificar el archivo")
        }
    }

    agregarAlCarrito(idCarrito,producto)
    { 
        let i=0;
        try{
            this.getAll()
            let idEncontrado=-1;
            for(i=0; i<this.listadoCarritos.length;++i)
            {
                if (this.listadoCarritos[i].idCarrito==idCarrito){
                    idEncontrado=i;
                    break;
                }
            }
            if (idEncontrado>-1){
                this.listadoCarritos[idEncontrado].productos.push(producto);
                fs.writeFileSync(this.nombre,JSON.stringify(this.listadoCarritos))
                return true 
            }
            else {
                console.log("No se encontro el carrito")
                return false
            }            
        }
        catch{
            console.log("No se pudo guardar el archivo")
        }
    }

    quitarDelCarrito(idCarrito,idProducto){
        let i=0;
        try{
            this.getAll()
            let indiceCarritoEncontrado=-1,indiceProductoEncontrado=-1;
            //Busco  del indice del carrito
            for(i=0; i<this.listadoCarritos.length;++i)
            {
                //Si lo encuentro lo guardo y salgo del for
                if (this.listadoCarritos[i].idCarrito==idCarrito){
                    indiceCarritoEncontrado=i;
                    break;
                }
            }
            //Si encuentro el indice del carrito busco el indice del producto
            if (indiceCarritoEncontrado>-1){
                for(i=0; i<this.listadoCarritos[indiceCarritoEncontrado].productos.length;++i){
                    //Si lo encuentro el dindice del producto lo guardo y salgo del for
                    if (this.listadoCarritos[indiceCarritoEncontrado].productos[i].idProducto==idProducto){
                        indiceProductoEncontrado=i;
                        break;
                    }
                }
                //Si encontre el indice del producto lo borro y guardo el archivo
                if(indiceProductoEncontrado>-1){
                    this.listadoCarritos[indiceCarritoEncontrado].productos.splice(indiceProductoEncontrado,1)
                    fs.writeFileSync(this.nombre,JSON.stringify(this.listadoCarritos))
                    return 0
                }
                else{ //si no encuentro el producto
                    console.log("No se encontro el producto")
                    return 1
                } 
            }
            else{ //si no encuentro el carrito
                console.log("No se encontro el carrito")
                return 2
            }            
        }
        catch(err){
            console.log("No se pudo guardar el archivo")
            console.log(err)
            return 3
        } 
    }
}