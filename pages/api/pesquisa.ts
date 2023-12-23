import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { validJWTToken } from "../../middlewares/validJWTToken";
import { UsuarioModel } from "../../models/userModel";

const pesquisaEndpoint 
= async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) =>{
    try {
        if (req.method === 'GET') {
            const {filtro} = req.query;

            if (!filtro || filtro.length < 2) {
                return res.status(400).json({error : "Deve informar pelo menos dois caracteres"})
            }

            const usuariosEnconstrados = await UsuarioModel.find({
                $or: [
                    { nome : {$regex : filtro, $options: 'i'}},
                    { email : {$regex : filtro, $options: 'i'} }
                 ]
                
            });

            return res.status(200).json(usuariosEnconstrados);
        }
        return res.status(405).json({error : "Method Not Valid"})
    } catch (e) {
        console.log(e);
        res.status(500).json({error : "Nao foi possivel buscar usuario"});
    }
}

export default validJWTToken(conectarMongoDB(pesquisaEndpoint));