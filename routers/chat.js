import { borrarChatController, chatInitController, chatsUsuarioController } from "../controllers/chat_controller.js";
import { checkAdmin, checkAuthentication } from "../utils/auth.js";
import express from "express";

export const routerChat = express.Router()

//Direccion para cargar la pagina de chat
routerChat.get('/',checkAuthentication, chatInitController);

//Direccion para borrar todos los productos de la base de datos
routerChat.get('/borrarchat',checkAuthentication,checkAdmin, borrarChatController);

//Direccion para ver los chat que envio un usuario en particular
routerChat.get('/:username',checkAuthentication,chatsUsuarioController)

