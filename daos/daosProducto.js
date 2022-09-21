import Contenedor_Mongo from "./contenedores/Contenedor_Mongo.js";
import Contenedor_Firebase from "./contenedores/Contenedor_Firebase.js";


export class DaosProductoMongo extends Contenedor_Mongo{
    constructor(nombre,schema){
        super(nombre,schema)
    }
}

export class DaosProductoFirebase extends Contenedor_Firebase{ 
    constructor(nombre){
        super(nombre)
    }
}

