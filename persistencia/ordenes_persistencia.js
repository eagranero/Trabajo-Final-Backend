import ordenesFactoryDAO from "../daos/daosOrdenes.js";
import config from "../config.js";

export const ordenes= new ordenesFactoryDAO(config.TIPO_PERSISTENCIA,"ordenes")
