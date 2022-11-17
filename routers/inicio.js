import express, { json } from "express";
import { usuarios } from "./login.js";

export const routerInicio = express.Router()


function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  }
  

//Direccion para cargar la pagina principal
routerInicio.get('/',checkAuthentication, async (req, res) => {
    let login=req.session.user;
    let usuario= await usuarios.buscar({username:login})
    let foto="/perfiles/"+usuario.foto
    res.render('body',{login,foto});
});
