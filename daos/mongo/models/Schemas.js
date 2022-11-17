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
  thumbnail: { type: String, required: true }

});

export const SchemaCarrito = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  productos: { type: Array, required: true }

});


