import { Schema, model } from 'mongoose';

export const SchemaUsuario = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  username: { type: String, required: true },
  password: { type: String, required: true },
  nombre: { type: String, required: false },
  direccion: { type: String, required: false },
  edad: { type: Number, required: false },
  telefono: { type: String, required: false },
  foto: { type: String, required: false },
  carritoId: { type: String, required: true }

});

export const SchemaProducto = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  categoria: { type: String, required: true },
  thumbnail: { type: String, required: true }

});

export const SchemaCarrito = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  productos: { type: Array, required: true }

});

export const SchemaOrdenes = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  numeroDeOrden: { type: Number, required: true },
  email: { type: String, required: true, max: 100 },
  estado: { type: String, required: true, max: 100 },
  productos: { type: Array, required: true }

});

export const SchemaChat = new Schema({
  
 /* author: { type: Object, required: true },
  text: {type: String, required: true, max: 100}
*/
  timeStamp: { type: String, required: true, max: 100 },
  email:{ type: String, required: true, max: 100 },
  tipo:{ type: String, required: true, max: 100 },
  mensaje:{ type: String, required: true, max: 100 },

});


