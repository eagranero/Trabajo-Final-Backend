import { carritos } from "../persistencia/carritos_persistencia.js"
import { ordenes } from "../persistencia/ordenes_persistencia.js"
import { listadoProductos } from "../persistencia/productos_persistencia.js"
import { usuarios } from "../persistencia/usuarios_persistencia.js"
import logger from "../utils/logger.js"
import { nuevaCompraMail } from "../utils/mail.js"


//Funcion auxiliar para agrupar items e indicar cantidad de cada uno
const agrupar = (array)=> {
  let arrayAgrupado=[]
  let elemento
  let encontrado=false  
  for (let indice1=0;indice1<array.length;++indice1){
    for (let indice2=0;indice2<arrayAgrupado.length;++indice2){
      if(array[indice1]._id.toString()==arrayAgrupado[indice2]._id.toString()){
        arrayAgrupado[indice2].cantidad++
        encontrado=true
        break
      } 
    }
    if(!encontrado){
      elemento=array[indice1]
      elemento.cantidad=1
      arrayAgrupado.push(elemento)
    }
    encontrado=false
  }
  return arrayAgrupado 
}



export const initCarritoController = async (req, res) => {
    let login=req.session.user
    let usuario= await usuarios.buscar({username:login})
    usuario.foto="/perfiles/"+usuario.foto
    let carrito= await carritos.getById(usuario.carritoId)
    let items=carrito.productos || []
    let agrupados=agrupar(items)
    usuario.items=agrupados
    res.render('carrito',{usuario,items:agrupados});
}


export const borrarCarritoController = async (req, res) => {
  let user=await usuarios.buscar({username:req.session.user})
  await carritos.borrarElementosCarrito(user.carritoId)
  res.redirect("/api/carrito")
}

export const compraCarritoController = async (req, res) => {
    logger.info("Compra Realizada")
    let user=await usuarios.buscar({username:req.session.user})
    let carrito = await carritos.getById(user.carritoId)
    await ordenes.save_orden(user.username,agrupar(carrito.productos))

    nuevaCompraMail(user,agrupar(carrito.productos))
    await carritos.borrarElementosCarrito(user.carritoId)
    res.redirect("/api/carrito")
  }

  export const agregarItemCarritoController = async (req,res)=>{
    const {id} = req.params;
    let user=await usuarios.buscar({username:req.session.user})
    let producto = await listadoProductos.getById(id)
    await carritos.agregarAlCarrito(user.carritoId,producto)
    res.redirect("/api/carrito")
  }

  export const quitarItemCarritoController = async (req,res)=>{
    const {id} = req.params;
    let user=await usuarios.buscar({username:req.session.user})
    await carritos.quitarDelCarrito(user.carritoId,id)
    res.redirect("/api/carrito")
  }

