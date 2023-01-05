import { listadoProductos } from './persistencia/productos_persistencia.js';
import { listadoChat } from './persistencia/chat_persistencia.js';
import { usuarioLogueado } from './controllers/login_controller.js'


let chat=[]

export const socket=(io)=>{
    io.on("connection", async (socket) => {

        chat = await listadoChat.getAll();

        let date = new Date();
        io.sockets.emit("listadoProductos", await listadoProductos.getAll());

        io.sockets.emit("listadoChat", chat);
        
        socket.on("msg-chat", async (data) => {
            data.email=usuarioLogueado
            listadoChat.save(data);
            chat = await listadoChat.getAll();
            io.sockets.emit("listadoChat", chat);
        });

        socket.on("nuevoProducto",async (data) => {
            await listadoProductos.save(data) 
            io.sockets.emit("listadoProductos", await listadoProductos.getAll());
        });
    });

}