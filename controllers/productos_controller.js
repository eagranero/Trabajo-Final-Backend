import { deleteAll_ChatPersistencia } from "../persistencia/chat_persistencia.js";
import { deleteAll_ProductosPersistencia, listadoProductos} from "../persistencia/productos_persistencia.js";
import { usuarios } from "../persistencia/usuarios_persistencia.js";

export const initPorductosController = async (req, res) => {
    let login=req.session.user
    let usuario= await usuarios.buscar({username:login})

    try{usuario.foto="/perfiles/"+usuario.foto}
    catch{usuario.foto=""}

    res.render('productos',{usuario});
}


export const productosCategoriaController =async (req,res) =>{
    const {categoria} = req.params;
    
    let login=req.session.user
    let usuario= await usuarios.buscar({username:login})
    usuario.foto="/perfiles/"+usuario.foto

    let productos = await listadoProductos.buscarTodos({categoria:categoria})
    res.render('productos_filtrado',{usuario,productos});
}


export const productoIdController =async (req,res) =>{
    const {id} = req.params;

    let login=req.session.user
    let usuario= await usuarios.buscar({username:login})
    usuario.foto="/perfiles/"+usuario.foto
    let productos = await listadoProductos.buscarTodos({_id:id})
    res.render('productos_filtrado',{usuario,productos});
}


export const borrarProductosController = async (req, res) => {
    deleteAll_ProductosPersistencia();
    res.redirect("/api/productos")
}

export const borrarChatController = async (req, res) => {
    deleteAll_ChatPersistencia();
    res.redirect("/api/productos")
}

export const agregarProductoController = async (req, res) => {
    const {nombre,precio,descripcion,categoria} = req.body;
    await listadoProductos.save({
        nombre:nombre, 
        precio:precio, 
        categoria:categoria,
        descripcion:descripcion, 
        thumbnail:"../thumbnail/"+await req.file.filename
    })
    
    res.redirect("/api/productos")
}