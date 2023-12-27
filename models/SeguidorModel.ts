import mongoose, {Schema} from "mongoose";

const SeguidorSchema = new Schema({
    //QUEM FO
    usuarioSeguirId : {type : String, required : true},
    usuarioSeguindoId : {type : String, required : true}

});

export const SeguidorModel = (mongoose.models.seguidores ||
    mongoose.model('seguidores',SeguidorSchema));