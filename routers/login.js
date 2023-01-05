import express from "express";
import { loginController, initController, logoutController, signupController } from "../controllers/login_controller.js";
import passport from "passport";
import { checkAdmin, checkAuthentication, passportInitialize } from "../utils/auth.js";
import { upload } from "../utils/upload.js";
import { validarDatosUsuario } from "../utils/validacion.js";
import { usuarios } from "../persistencia/usuarios_persistencia.js";

export const routerLogin = express.Router()
passportInitialize();

routerLogin.get('/', initController);


routerLogin.post('/',
  passport.authenticate("login", { failureRedirect: "login/faillogin" }),
  loginController
); 

routerLogin.get("/faillogin", async (req, res) => {res.render("login_error")})

routerLogin.get('/signup', async (req, res) => {res.render('registro')})

routerLogin.post('/signup',await upload.single('perfiles'),validarDatosUsuario,
  passport.authenticate("signup", { failureRedirect: "/login/failsignup" }),
  signupController 
);

routerLogin.get("/failsignup", async (req, res) => {res.render("signup_error")})

routerLogin.get("/logout",logoutController)

routerLogin.get('/admin',checkAuthentication,checkAdmin,async (req, res) => {
  let login=req.session.user;
  let usuario= await usuarios.buscar({username:login})
  usuario.foto="/perfiles/"+usuario.foto
  res.render('admin',{usuario});
});
