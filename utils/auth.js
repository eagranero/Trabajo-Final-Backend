
import { createHash, isValidPassword } from "../utils/encriptacion.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { usuarios } from "../persistencia/usuarios_persistencia.js";
import { carritos } from "../persistencia/carritos_persistencia.js";
import logger from "./logger.js";

export const passportInitialize =  ()=>{
    passport.use(
        "login",
        new LocalStrategy(async (username, password, done) => {
            let usuarioAuth = await usuarios.buscar({ username:username })
            if (!usuarioAuth) {
                logger.info("Login:Usuario no encontrado");
                done(null, false);
            }else{
                if (!isValidPassword(usuarioAuth, password)) {
                    logger.info("Login:Contraseña invalida");
                    done(null, false);
                }else{
                    logger.info("Login:Usuario Autenticado");
                    done(null, usuarioAuth);
                }
            }
        })
    );
    
    passport.use(
        "signup",
        new LocalStrategy({passReqToCallback: true},
        async (req, username, password, done) => {
            let usuarioAuth = await usuarios.buscar({ username:username })
            if (usuarioAuth) {
                logger.info("Signup:El usuario ya existe");
                done(null, false);
            }else{
                const newUser = {
                    username: username,
                    password: createHash(password),
                    nombre:"",
                    direccion:"",
                    edad:-1,
                    telefono:-1,
                    foto:"",
                    timeStamp:new Date().toLocaleString(),
                    carritoId: await carritos.save({productos:[]})
                  };
                await usuarios.save(newUser)
                logger.info("Signup:Usuario registrado correctamente");
                done(null, await usuarios.buscar({ username:username }))           
            }
        }
    ));
    
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser(async (_id, done) => {
        done(null,await usuarios.getById(_id))
    });
}

export const checkAuthentication = (req, res, next) =>{
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/login");
    }
  }


  export const checkAdmin = (req, res, next) =>{
    if (req.session.user=="admin@admin.com") {
      next();
    } else {
      res.redirect("/api/productos");
    }
  }
