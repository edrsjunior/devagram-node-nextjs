import type{ NextApiRequest, NextApiResponse } from "next";
import type{ RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { UsuarioModel } from "../../models/userModel";
import { PublicacaoModel } from "../../models/publicacaoModel";
import { validJWTToken } from "../../middlewares/validJWTToken";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";

const feedEndpoint = async (req:NextApiRequest, res : NextApiResponse<RespostaPadraoMsg> | any) => {
    try {
        
        if (req.method === 'GET') {
            if (req?.query?.id) {
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if (!usuario) {
                    return res.status(400).json({error : 'User not found'})
                }

                const publicacoes = await PublicacaoModel
                    .find({idUsuario : usuario._id})
                    .sort({data : -1});

                return res.status(200).json(publicacoes);
            }
        }
        return res.status(405).json({error : 'Metodo informado nao é valido'})
    } catch (e) {
        console.log(e);
        return res.status(400).json({error : 'Nao foi possivel obter o feed'})
    }
}

export default validJWTToken(conectarMongoDB(feedEndpoint));