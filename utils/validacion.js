import logger from "./logger.js";


export const validarDatosUsuario = function(req,res,next){
    const {body} = req;
    const { username,password, password2 } = body;
    const validEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    
    if( validEmail.test(username) ){
        logger.info("Mail valido")
        if(password===password2){
            logger.info("Las contraseñas coinciden")
            next()
        }else{
            logger.info("Las contraseñas no coinciden")
            res.render("signup_error")
        }
	}else{
		logger.info("Mail no valido")
        res.render("signup_error")
	}
  }