import ProductosFactoryDAO from "../daos/daosProducto.js";
import config from "../config.js";

export const listadoProductos= new ProductosFactoryDAO(config.TIPO_PERSISTENCIA,"productos")

export const deleteAll_ProductosPersistencia= async ()=>{
    await listadoProductos.deleteAll()
}
