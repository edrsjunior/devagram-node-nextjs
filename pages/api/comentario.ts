import type { NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { validJWTToken } from "../../middlewares/validJWTToken";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { UsuarioModel } from "../../models/userModel";
import { PublicacaoModel } from "../../models/publicacaoModel";

const comentarioEndpoint = async(req: NextApiRequest, res: NextApiResponse) =>{
    try {
        if (req.method === 'PUT') {
            const {userId, id} = req.query;

            const usuarioLogado = await UsuarioModel.findById(userId);
            if (!usuarioLogado) {
                return res.status(400).json({error : 'Usuario Not Found'});
            }

            const publicacao = await PublicacaoModel.findById(id);
            if (!publicacao) {
                return res.status(400).json({error : 'Publicacao Not Found'});
            }

            if (!req.body || !req.body.comentario
                || req.body.comentario.length < 2) {
                    return res.status(400).json({error : 'Invalid Comment'});
            }

            const comentario = {
                usuarioId : usuarioLogado._id,
                nome : usuarioLogado.nome,
                comentario : req.body.comentario
            }

            publicacao.comentarios.push(comentario);

            await PublicacaoModel.findByIdAndUpdate({_id : id},publicacao);
            return res.status(200).json({msg : 'Comment Added With Success!'});

        } else {
            return res.status(405).json({error : 'Method Not Allowed!'});
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({error : 'Nao foi possivel att a publicacao'});
    }
}

export default validJWTToken(conectarMongoDB(comentarioEndpoint));