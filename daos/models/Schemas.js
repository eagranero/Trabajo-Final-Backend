import { Schema, model } from 'mongoose';

export const SchemaProducto = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  nombre: { type: String, required: true, max: 100 },
  descrcipcion: { type: String, required: true, max: 100 },
  codigo: { type: String, required: true, max: 100 },
  foto: { type: String, required: true, max: 100 },
  precio: { type: Number, required: true },
  stock: { type: Number, required: true }

});

export const SchemaCarrito = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  productos: { type: Array, required: true }

});
