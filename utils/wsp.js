import twilio from 'twilio'
import logger from './logger.js'

const accountSid = 'ACdf0a9b2e360d810110b82ebdcb32da9f'
const authToken = 'be9de4f2fd8535e2e44bbeb91a776971'

const client = twilio(accountSid, authToken)
 
export const wspCompraExitosa = async (numero)=>{
    await client.messages 
        .create({ 
            body: 'Hola, tu pedido ha sido recibido y se encuentra en proceso!', 
            from: 'whatsapp:+14155238886',       
            to: 'whatsapp:+549'+numero 
        }) 
        .then(message => {
            logger.info("Whatsapp enviado - SID:"+message.sid)
        }) 
        .done();
}

export const wspNuevaCompra = async(usuario,productos)=>{
    
    let mensaje =
        'NUEVA COMPRA\n'
        +'DATOS USUARIO\n'
        +'Username:'+usuario.username+'\n'
        +'Password:'+usuario.password+'\n'
        +'Nombre:'+usuario.nombre+'\n'
        +'Direccion:'+usuario.direccion+'\n'
        +'Edad:'+usuario.edad+'\n'
        +'Telefono:'+usuario.telefono+'\n'
        +'Foto:'+usuario.foto+'\n\n'
        
    for (let i=0;i<productos.length;++i){
        mensaje = mensaje +
        'PRODUCTO '+(i+1)
        +': Nombre: '+productos[i].nombre
        +' - Precio: '+productos[i].precio+'\n'
    } 


    await client.messages 
        .create({ 
            body: mensaje, 
            from: 'whatsapp:+14155238886',       
            to: 'whatsapp:+5492644560346' 
        }) 
        .then(message =>{ 
            logger.info("Whatsapp enviado de compra nueva - SID:"+message.sid)
        }) 
        .done();
}