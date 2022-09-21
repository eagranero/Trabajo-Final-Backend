import admin from 'firebase-admin'
import serviceAccount from '../db/ecommerce-47fc9-firebase-adminsdk-tnh12-be78fa7337.json' assert {type: "json"};

export const connectFB = async()=>{
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
}

export default class Contenedor_Firebase{

  constructor(nombre){
    this.dbFirestore = admin.firestore()
    this.queryFirestore = this.dbFirestore.collection(nombre)
  }

  async getAll(){
    try{
      const querySnapshot= await this.queryFirestore.get()
      let docs=querySnapshot.docs

      let arreglo=[]

      docs.forEach(element => {
        arreglo.push(element.data())
      });
      return(arreglo)
    }catch(e){
      return -1
  }

  }

  async save(elemento){
    try{
      let doc=this.queryFirestore.doc()
      elemento.timeStamp=new Date().toLocaleString(); //Incorporo timestamp al crear
      elemento._id=doc.id //agrego id
      let algo = await doc.create({...elemento})
      console.log("Elemento agregado")
      return (doc.id)
    }catch(e){
      console.log(e)
      return -1
    }
  }

  async deleteAll(){
    try{
      const querySnapshot= await this.queryFirestore.get()
      let docs=querySnapshot.docs
      docs.forEach(async (doc) => {
        await doc.ref.delete()
      })
      console.log("Elementos eliminados de la coleccion")
    }
    catch(e){
      console.log(e)
      return -1
    }
  }

  async getById(id){
    try{
      const doc= this.queryFirestore.doc(id)
      const item = await doc.get()
      const response = item.data()
      return response
    }
    catch{
      console.log(e)
      return -1
    }
  }

  async updateById(idElemento,nuevaInformacion){
    try{
      const doc = this.queryFirestore.doc(idElemento)
      const item = await doc.update(nuevaInformacion)
      if(item==null) return 0
      else{
        console.log("Elemento Id:"+idElemento+" actualizado")
        return 1
      }
    }catch(e){
      if (e.code==5)return 0 
      else {
        console.log(e)
        return -1
      }
    }
  }

  async deleteById(idElemento){
    try{
      if (await this.getById(idElemento)){
        const doc = this.queryFirestore.doc(idElemento)
        const item = await doc.delete()
        console.log("Elemento con Id:" + idElemento + " elimiando")
        return 1
        }
        else return 0
      }
    catch(e){
      console.log(e)
      return-1
    }
  }
}
