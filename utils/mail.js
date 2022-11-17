import { createTransport } from 'nodemailer';
import logger from './logger.js';

const MAIL_ADMIN = 'augustine.bogisich@ethereal.email'

const transporter = createTransport({
   host: 'smtp.ethereal.email',
   port: 587,
   auth: {
       user: MAIL_ADMIN,
       pass: 'erhC4E41whMR7f8nJS'
   }
});


export default async function enviarMail(from,to,subject,html){

    const mailOptions={
        from:from,
        to:to,
        subject:subject,
        html:html
    }

    if(to=="admin") mailOptions.to=MAIL_ADMIN

    try {
        const info = await transporter.sendMail(mailOptions)
        logger.info("Mail Enviado")
        //console.log(info)
    } catch (err) {
        logger.error("No se pudo enviar el mail")
        console.log(err)
    }
}
 

export const nuevoUsuarioMail = (usuario)=>{
enviarMail(
    "servidor",
    "admin",
    "Nuevo Registro",
    '<div>'
        +'<p>Username:'+usuario.username+'</p>'
        +'<p>Password:'+usuario.password+'</p>'
        +'<p>Nombre:'+usuario.nombre+'</p>'
        +'<p>Direccion:'+usuario.direccion+'</p>'
        +'<p>Edad:'+usuario.edad+'</p>'
        +'<p>Telefono:'+usuario.telefono+'</p>'
        +'<p>Foto:'+usuario.foto+'</p>'
    +'</div>'
    )
}

export const nuevaCompraMail = (usuario,productos)=>{

    const mailOptions={
        from:"servidor",
        to:"admin",
        subject:"",
        html:""
    }

    mailOptions.subject="Nuevo pedido de "+usuario.nombre

    mailOptions.html=
    '<div>'
        +'<h1>Usuario</h1>'
        +'<p>Username:'+usuario.username+'</p>'
        +'<p>Password:'+usuario.password+'</p>'
        +'<p>Nombre:'+usuario.nombre+'</p>'
        +'<p>Direccion:'+usuario.direccion+'</p>'
        +'<p>Edad:'+usuario.edad+'</p>'
        +'<p>Telefono:'+usuario.telefono+'</p>'
        +'<p>Foto:'+usuario.foto+'</p>'
    +'</div>'

    mailOptions.html+='<div><h1>Productos</h1>';
    for(let i=0;i<productos.length;++i){
        mailOptions.html+='<p>Nombre:'+productos[i].nombre+'</p>'
        mailOptions.html+='<p>Precio:'+productos[i].precio+'</p>'
    }
    mailOptions.html+='</div>';
    enviarMail(mailOptions.from,mailOptions.to,mailOptions.subject,mailOptions.html);
        
    }