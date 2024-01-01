import type{ NextApiRequest, NextApiResponse } from "next";
import type{ RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { UsuarioModel } from "../../models/userModel";
import { PublicacaoModel } from "../../models/publicacaoModel";
import { validJWTToken } from "../../middlewares/validJWTToken";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { SeguidorModel } from "../../models/SeguidorModel";
import { corsPolicy } from "../../middlewares/corsPolicy";

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
            } else {
                const {userId} = req.query;
                const usuarioLogado = await UsuarioModel.findById(userId);
                if (!usuarioLogado) {
                    return res.status(400).json({error : 'Usuario Nao Encontrado'})
                }
                const seguidores = await SeguidorModel.find({usuarioSeguindoId : usuarioLogado._id});

                const seguidoresIds = seguidores.map(s => s.usuarioSeguirId);

                const publicacoes = await PublicacaoModel.find({
                    $or : [
                        {idUsuario : usuarioLogado._id},
                        {idUsuario : seguidoresIds}
                    ],
                })
                .sort({data : -1});       
                
                const result = [];

                for (const publicacao of publicacoes) {
                    const userDaPublicacao = await UsuarioModel.findById(publicacao.idUsuario);

                    if (userDaPublicacao) {
                        const final = {...publicacao._doc, usuario : {
                            nome : userDaPublicacao.nome,
                            avatar : userDaPublicacao.avatar
                        }};
                        result.push(final);
                    }
                }

                res.status(200).json(result);
            }
        }
        return res.status(405).json({error : 'Metodo informado nao é valido'})
    } catch (e) {
        console.log(e);
        return res.status(400).json({error : 'Nao foi possivel obter o feed'})
    }
}

export default corsPolicy(validJWTToken(conectarMongoDB(feedEndpoint)));