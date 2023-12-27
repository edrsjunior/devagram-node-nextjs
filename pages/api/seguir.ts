import type { NextApiRequest, NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { validJWTToken } from "../../middlewares/validJWTToken";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { UsuarioModel } from "../../models/userModel";
import { SeguidorModel } from "../../models/SeguidorModel";

const endpointSeguir = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    try {
        if (req.method === 'PUT') {
            const {userId, id} = req?.query;


            //USUARIO LOGADO/AUTENTICADO => QUEM ESTA SOLICITANDO AS ACOES
            const usuarioLogado = await UsuarioModel.findById(userId);

            if (!usuarioLogado) {
                return res.status(400).json({error : "User Logged Not Found"}); 
            }

            //ID DO USER A SER SEGUIDO
            const usuarioSeguir = await UsuarioModel.findById(id);

            if (!usuarioSeguir) {
                return res.status(400).json({error : "User To Follow Not Found"}); 
            }

            const alreadyFollowing = await SeguidorModel
                .find({usuarioSeguindoId : usuarioLogado._id, usuarioSeguirId : usuarioSeguir._id});

            if (alreadyFollowing && alreadyFollowing.length > 0 ) {
                //SIGO ESSE USER
                alreadyFollowing.forEach(async(e : any) => await SeguidorModel.findByIdAndDelete({_id : e._id}));
                usuarioLogado.following--;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id}, usuarioLogado);
                usuarioSeguir.followers--;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioSeguir._id}, usuarioSeguir);

                return res.status(200).json({msg : 'Usuario deixado de seguir com sucesso'});

            } else {
                //NAO SIGO ESSE USER
                const newFollower = {
                    usuarioSeguindoId : usuarioLogado._id, 
                    usuarioSeguirId : usuarioSeguir._id
                };
                await SeguidorModel.create(newFollower);

                //AUMENTA O <SEGUINDO> DO USER LOGADO
                usuarioLogado.following++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                //AUMENTA O <SEGUIDORES> DO USER TO FoLLOW
                usuarioSeguir.followers++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioSeguir._id}, usuarioSeguir);

                return res.status(200).json({msg : 'Usuario seguido com sucesso'});
            }
        }

        return res.status(405).json({error : "Method Not Allowed"});

    } catch (e) {
        console.log(e);
        return res.status(500).json({error : "Nao foi possivel follow/unfollow o usuario informado"});
    }
}

export default validJWTToken(conectarMongoDB(endpointSeguir));