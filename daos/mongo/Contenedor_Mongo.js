import { connect } from 'mongoose';
import { model } from 'mongoose';
import logger from '../../utils/logger.js';


export const connectMG = async(nombre)=>{
    try {
        return await connect("mongodb+srv://eduardo:123456a@cluster0.fbnxtxd.mongodb.net/?retryWrites=true&w=majority")
      } catch (e) {
        console.log(e);
        logger.error("Error al intentar conectar a la base de datos de Mongo")
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
            return await this.collectionElement.find({}).lean();
        }catch(e){
            logger.error("No se pudo obtener los datos de Mongo")
        }
    }

    async buscar(elemento){
        try{
            let encontrado=await this.collectionElement.findOne(elemento).lean();
            return encontrado
        }catch(e){
            logger.error("No se pudo obtener el dato buscado de Mongo")
            return (e)
        }
    }


    async buscarTodos(elemento){
        try{
            let encontrado=await this.collectionElement.find(elemento).lean();
            return encontrado
        }catch(e){
            logger.error("No se pudo obtener el dato buscado de Mongo")
            return []
        }
    }

    //Funcion para agregar un elemento nuevo
    async save(elemento){
        try {
            elemento.timeStamp=new Date().toLocaleString(); //Incorporo timestamp al crear
            const nuevo = new this.collectionElement(elemento);
            await nuevo.save()
            logger.info("Elemento agregado a la coleccion de Mongo")
            return nuevo._id.toString() 
        }catch(e) {
            console.log(e)
            logger.error("No se pudo guardar el dato en Mongo")
        }
    }


    //funcion para quitar un elemento con cualquier tipo de argumento
    async quitarElemento(argumento){
        try {
            await this.collectionElement.deleteOne(argumento);
            logger.info("Elemento eliminado de la coleccion de mongo")
        }catch(e) {
            logger.error("No se pudo quitar el dato en Mongo")
        }
    }

    //Funcion para obtener un elemento a partir de su id
    async getById(id){
        try{
            const elemento = await this.collectionElement.findById(id).lean();
            return elemento
        }
        catch(e){
            logger.error("No se pudo obtener el dato de Mongo")
            return -1;  
        }
    }

        //Funcion para obtener un elemento a partir de su id
        async getByIdFunc(id,func){
            try{
                const elemento = await this.collectionElement.findById(id,func).lean();
                return elemento
            }
            catch(e){
                logger.error("No se pudo obtener el dato de Mongo")
                return e;  
            }
        }
    
    //Funcion para eliminar elemento indicando id
    async deleteById(id){
        try{
            if(await this.collectionElement.findByIdAndDelete(id)==null)return 0;
            else{
                logger.info("Elemento con Id:"+id+" eliminado de la coleccion de Mongo")
                return 1
            }
        }
        catch(e){
            logger.error("No se pudo eliminar el dato de Mongo")
            return -1
        }
    } 

    //Funcion para eliminar todos los elementos de una coleccion
    async deleteAll(){
        try {
            await this.collectionElement.deleteMany();
            logger.info("Se elminaron todos los documentos de la coleccion de Mongo")
        }catch(e) {
            logger.error("No se pudieron eliminar los datos de Mongo");
        }
    }

    async updateById(idElemento,nuevaInformacion){
        try{
            await this.collectionElement.findByIdAndUpdate(idElemento,nuevaInformacion)
            logger.info("Dato actualizado en mongo")
        }catch(e){
            logger.error("No se pudo actualizar el dato en Mongo")
            return -1
        }
    }

    
}

