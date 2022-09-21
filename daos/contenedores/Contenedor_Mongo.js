import { connect } from 'mongoose';
import { model } from 'mongoose';


export const connectMG = async(nombre)=>{
    try {
        return await connect('mongodb://localhost:27017/'+nombre, { useNewUrlParser: true });
      } catch (e) {
        console.log(e);
      }
}

export default class Contenedor_Mongo{

    constructor(nombre,schema){
        this.nombre=nombre
        this.collectionElement = model(nombre, schema);
    }

    //Funcion para obtener todos los elementos de una coleccion
    async getAll(){
        try{
            return await this.collectionElement.find({});
        }catch(e){
            console.log(e)
        }
    }

    //Funcion para agregar un elemento nuevo
    async save(elemento){
        try {
            elemento.timeStamp=new Date().toLocaleString(); //Incorporo timestamp al crear
            const ProductoNuevo = new this.collectionElement(elemento);
            ProductoNuevo.save()
            console.log("Elemento agregado")
            return ProductoNuevo._id.toString() 
        }catch(e) {
            console.log(e);
        }
    }


    //funcion para quitar un elemento con cualquier tipo de argumento
    async quitarElemento(argumento){
        try {
            await this.collectionElement.deleteOne(argumento);
            console.log("Elemento quitado")
        }catch(e) {
            console.log(e);
        }
    }

    //Funcion para obtener un elemento a partir de su id
    async getById(id){
        try{
            const elemento = await this.collectionElement.findById(id);
            return elemento
        }
        catch(e){
            console.log(e)
            return -1;  
        }
    }
    
    //Funcion para eliminar elemento indicando id
    async deleteById(id){
        try{
            if(await this.collectionElement.findByIdAndDelete(id)==null)return 0;
            else{
                console.log("Elemento con Id:"+id+" eliminado")
                return 1
            }
        }
        catch(e){
            console.log(e)
            return -1
        }
    } 

    //Funcion para eliminar todos los elementos de una coleccion
    async deleteAll(){
        try {
            await this.collectionElement.deleteMany();
            console.log("Se elminaron todos los documentos")
        }catch(e) {
            console.log(e);
        }
    }

    async updateById(idElemento,nuevaInformacion){
        try{
            let elementoActual=await this.getById(idElemento)
            if (elementoActual!=null){
                if (nuevaInformacion.nombre)elementoActual.nombre=nuevaInformacion.nombre;
                if (nuevaInformacion.descripcion)elementoActual.descripcion=nuevaInformacion.descripcion;
                if (nuevaInformacion.codigo)elementoActual.codigo=nuevaInformacion.codigo;
                if (nuevaInformacion.foto)elementoActual.foto=nuevaInformacion.foto;
                if (nuevaInformacion.precio)elementoActual.precio=nuevaInformacion.precio;
                if (nuevaInformacion.stock)elementoActual.stock=nuevaInformacion.stock;
                await this.collectionElement.findByIdAndUpdate(idElemento,elementoActual)
                return 1
            }else return 0

        }catch(e){
            console.log(e);
            return -1
        }
    }
}

