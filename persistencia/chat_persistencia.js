import config from "../config.js";
import ChatFactoryDAO from "../daos/daosChat.js";

export const listadoChat= new ChatFactoryDAO(config.TIPO_PERSISTENCIA,"chat")


export const deleteAll_ChatPersistencia= async ()=>{
    await listadoChat.deleteAll()
}