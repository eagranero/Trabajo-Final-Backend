import { deleteAll_ChatPersistencia } from "../persistencia/chat_persistencia.js";
import { listadoChat } from "../persistencia/chat_persistencia.js";
import { usuarios } from "../persistencia/usuarios_persistencia.js";


export const chatInitController = async (req, res) => {
    let login=req.session.user;
    try{
      let usuario= await usuarios.buscar({username:login})
      usuario.foto="/perfiles/"+usuario.foto
      res.render('chat',{usuario});}
    catch{
      res.redirect("/login");
    }
}

export const chatsUsuarioController = async (req,res)=>{
    const {username} = req.params;
    let login=req.session.user;
  
    let usuario= await usuarios.buscar({username:login})
    usuario.foto="/perfiles/"+usuario.foto
      
    let chats = await listadoChat.buscarTodos({email:username})
    let emisor=username
    res.render('chat_email',{usuario,emisor,chats});
}


export const borrarChatController = async (req, res) => {
    deleteAll_ChatPersistencia();
    res.redirect("/api/chat")
}

