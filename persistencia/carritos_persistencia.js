
import config from "../config.js";
import carritosFactoryDAO from "../daos/daosCarrito.js";

export const carritos= new carritosFactoryDAO(config.TIPO_PERSISTENCIA,"carritos")

