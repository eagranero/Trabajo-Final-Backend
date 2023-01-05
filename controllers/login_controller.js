import { usuarios } from "../persistencia/usuarios_persistencia.js";
import { nuevoUsuarioMail } from "../utils/mail.js";

export let usuarioLogueado;


export const initController = async (req, res) => {
    if (req.isAuthenticated()) {  
      res.redirect('/api/productos')
    } else {
    res.render('login');}
}

export const loginController = async (req, res) => {
  const {body} = req;
  const { username, password } = body;
  req.session.user = username;
  usuarioLogueado=username
  req.session.admin = true;
  res.redirect('/api/productos')
}

export const signupController = async (req, res) => {
  const {body} = req;
  const { username, password } = body;
  req.session.user = username;
  req.session.admin = true;
  usuarioLogueado=username
  const user= await usuarios.buscar({username:username})

  user.nombre=body.nombre
  user.direccion=body.direccion
  user.edad=body.edad,
  user.telefono=body.telefono

  try{user.foto=await req.file.filename}
  catch{user.foto="perfil.webp"}

  await usuarios.updateById(user._id,user)

  nuevoUsuarioMail(user) //Envio mail de nuevo al administrador 
  res.redirect('/api/productos')
}

export const logoutController = (req, res) => {
  let login=req.session.user;
  req.session.destroy((err) => {
    if (err) {
      return res.json({ status: "Logout ERROR", body: err });
    } 
    res.render('logout',{login})
  })
}
