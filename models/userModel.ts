import mongoose from "mongoose";
import { Schema } from "mongoose";

const UsuarioSchema = new Schema({
    nome: {type : String, require: true },
    email: {type : String, require: true },
    senha: {type : String, require: true },
    avatar: {type : String, require: false },
    followers: {type : Number, default: 0 },
    following: {type : Number, default: 0 },
    posts: {type : Number, default: 0 },

});

export const UsuarioModel = (mongoose.models.usuarios || 
    mongoose.model('usuarios', UsuarioSchema));