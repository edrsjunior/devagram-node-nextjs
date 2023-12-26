import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { validJWTToken } from "../../middlewares/validJWTToken";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { PublicacaoModel } from "../../models/publicacaoModel";
import { UsuarioModel } from "../../models/userModel";

const likeEndpoint = async(req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>)=>{
    try {
        if (req.method === "PUT") {
            const {id} = req?.query;
            const publi = await PublicacaoModel.findById(id);
            if (!publi) {
                return res.status(400).json({error : "Publicacao not Found"});
            }
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({error : "User not Found"});
            }

            const indexDoUsuarioNoLike = publi.likes.findIndex((e : any) => e.toString() === usuario._id.toString());
            if (indexDoUsuarioNoLike != -1) {
                publi.likes.splice(indexDoUsuarioNoLike,1);
                await PublicacaoModel.findByIdAndUpdate({_id : publi._id}, publi);
                res.status(200).json({error : "Publi descurtida com sucesso"});
            }else{
                publi.likes.push(usuario._id);

                await PublicacaoModel.findByIdAndUpdate({_id : publi._id}, publi);

                res.status(200).json({error : "Publi curtida com sucesso"});
            }
        }   

        return res.status(405).json({error : "Method Not Allowed"});

    } catch (e) {
        console.log(e);
        return res.status(500).json({error : "Nao foi possivel atualizar o status do like"});
    }
}

export default validJWTToken(conectarMongoDB(likeEndpoint));