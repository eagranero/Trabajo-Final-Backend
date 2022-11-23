import express from "express";
import { usuarios } from "./login.js";

export const routerInfoUser = express.Router()


function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  }
  

//Direccion para cargar la pagina principal
routerInfoUser.get('/',checkAuthentication, async (req, res) => {
    let login=req.session.user;
    let usuario= await usuarios.buscar({username:login})
    usuario.foto="/perfiles/"+usuario.foto
    res.render('infoUser',usuario);
});
