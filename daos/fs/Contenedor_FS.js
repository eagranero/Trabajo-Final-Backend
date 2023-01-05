import  fs  from 'fs'
import logger from '../../utils/logger.js';

export default class Contenedor_FS{
    constructor(nombre){
        this.nombre=nombre+".txt"; 
        this.listado=[];
        this.ultimoID=0;
    }
  
  //Funcion para obtener todos los elementos del archivo. Los almacena en el listado y guarda el ultimo id asignado
    getAll(){
        let contenido;
        try{
            contenido = fs.readFileSync(this.nombre,'utf-8') || [];
            let listadoParce = JSON.parse(contenido) || [];
            this.listado=listadoParce;
            this.ultimoID=this.listado[this.listado.length-1]._id;
            return listadoParce
        }
        catch (err){
            logger.warn("El archivo "+this.nombre+" no existe o se encuentra vacio")
            return []
        }   
    }
  
  
    //Funcion para guardar volver a guardar todo el listado en archivo(se usa cuando modifico un elemento del listado)
    saveModificado(){ 
        try{
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))            
        }
        catch{
            logger.error("No se pudo guardar el archivo "+this.nombre)
        }
    }
  
    //Funcion para guardar un elemento nuevo en el archivo(asigna nuevo id)
    save(elemento)
    { 
        try{
            this.getAll()
            this.ultimoID++;
            elemento._id=this.ultimoID;
            elemento.timeStamp=new Date().toLocaleString(); //Incorporo timestamp al crear
            this.listado.push(elemento);
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
            return this.ultimoID;            
        }
        catch{
            logger.error("No se pudo guardar el archivo "+this.nombre)
        }
    }

    //Funcion para mostrar la informacion de un producto segun el ID. Retorna el indice del listado
    getById(indicador){
        try{
            this.getAll()
            let indice=-1;
            for(let i=0;i<this.listado.length;i++){
            if (this.listado[i]._id==indicador){
                indice = i;
            }
            }
            if(indice != -1) return this.listado[indice];
            else return []
        }
        catch{
            logger.error("No se pudo leer el archivo "+this.nombre)
            return null;  
        }
    } 

    //Funcion para eliminar un elemento del listado. Actualiza Archivo
    deleteByID(indicador){
        try{
            this.getAll()
            let indiceBorrar=-1;
            for(let i=0;i<this.listado.length;i++){
                if (this.listado[i]._id==indicador)
                {
                    indiceBorrar=i;
                }
            }
            if(indiceBorrar==-1){
                logger.info("No se encuentra el indice");
                return false; //Retorno false si no se encontro indice
            }
            else{
                this.listado.splice(indiceBorrar,1)
                fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                logger.info("Elemento borrado")
                return true; //Retorno true si lo encontro y elimino correctamente
            }    
        }
        catch{
            logger.error("No se pudo modificar el archivo "+this.nombre)
        }
    }

  //Funcion para eliminar todos los elementos del listado. Actualiza archivo
    deleteAll(){
        try{
            this.listado=[];
            this.ultimoID=0;
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
            logger.info("El contenido del archivo "+ this.nombre +" ha sido eliminado")
        }
        catch{
            logger.error("No se pudo modificar el archivo "+this.nombre)
        }
    }

    updateById(idElemento,nuevaInformacion){
        try{
            this.getAll()
            for(let i=0;this.listado.length;++i){
                if(this.listado[i]._id==idElemento){
                    nuevaInformacion._id=idElemento
                    this.listado[i]=nuevaInformacion
                    fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                    logger.info("Dato actualizado en el archivo")
                    break
                }
            }
        }catch(e){
            console.log(e)
            logger.error("No se pudo actualizar el dato en el archivo")
            return -1
        }
    }

}