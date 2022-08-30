import  fs  from 'fs'


export class itemProducto{
    constructor(nombre,descripcion,codigo,foto,precio,stock){
        this.timeStamp=Date.now()
        this.nombre=nombre;
        this.descrcipcion=descripcion,
        this.codigo=codigo;
        this.foto=foto;
        this.precio=precio,
        this.stock=stock,
        this.idProducto=""
    }
}

export default class Productos{
    constructor(nombre){
        this.nombre=nombre+".txt"; 
        this.listado=[];
        this.ultimoID=0;
    }
  
  //Funcion para obtener todos los elementos del archivo. Los almacena en el listado y guarda el ultimo id asignado
    getAll(){
        let contenido;
        try{
            contenido = fs.readFileSync(this.nombre,'utf-8') || "[]";
            let listadoParce = JSON.parse(contenido) || [];
            this.listado=listadoParce;
            this.ultimoID=this.listado[this.listado.length-1].idProducto;
            return listadoParce
        }
        catch (err){
            console.log("El archivo no existe o se encuentra vacio");
        }   
    }
  
  
    //Funcion para guardar volver a guardar todo el listado en archivo(se usa cuando modifico un elemento del listado)
    saveModificado(){ 
        try{
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))            
        }
        catch{
            console.log("No se pudo guardar el archivo")
        }
    }
  
    //Funcion para guardar un elemento nuevo en el archivo(asigna nuevo id)
    save(producto)
    { 
        try{
            this.getAll()
            this.ultimoID++;
            producto.idProducto=this.ultimoID;
            this.listado.push(producto);
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))            
        }
        catch{
            console.log("No se pudo guardar el archivo")
        }
    }

    //Funcion para mostrar la informacion de un producto segun el ID. Retorna el indice del listado
    getByID(indicador){
        try{
            this.getAll()
            let indice=-1;
            for(let i=0;i<this.listado.length;i++){
            if (this.listado[i].idProducto==indicador){
                indice = i;
            }
            }
            return indice;
        }
        catch{
            console.log("No se pudo leer el archivo")
            return null;  
        }
    } 

    //Funcion para eliminar un elemento del listado. Actualiza Archivo
    deleteByID(indicador){
        try{
            this.getAll()
            let indiceBorrar=-1;
            for(let i=0;i<this.listado.length;i++){
                if (this.listado[i].idProducto==indicador)
                {
                    indiceBorrar=i;
                }
            }
            if(indiceBorrar==-1){
                console.log("No se encuentra el indice");
                return false; //Retorno false si no se encontro indice
            }
            else{
                this.listado.splice(indiceBorrar,1)
                fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                console.log("Elemento borrado")
                return true; //Retorno true si lo encontro y elimino correctamente
            }    
        }
        catch{
            console.log("No se pudo modificar el archivo")
        }
    }

  //Funcion para eliminar todos los elementos del listado. Actualiza archivo
    deleteAll(){
        try{
            this.listado=[];
            this.ultimoID=0;
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
            console.log("El contenido del archivo ha sido eliminado")
        }
        catch{
            console.log("No se pudo modificar el archivo")
        }
    }
}