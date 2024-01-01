import type { NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { validJWTToken } from "../../middlewares/validJWTToken";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import { PublicacaoModel } from "../../models/publicacaoModel";
import { UsuarioModel } from "../../models/userModel";
import { corsPolicy } from "../../middlewares/corsPolicy";

const handler = nc()
    .use(upload.single('file'))
    .post(async(req: any, res: NextApiResponse<RespostaPadraoMsg>) =>{
        try{
            
            const {userId} = req.query;

            const usuario = await UsuarioModel.findById(userId);

            if (!usuario) {
                return res.status(400).json({error : 'Usuario not found'});
            }
            
            if (!req || !req.body) {
                return res.status(400).json({error : 'Parametros de entrada nao informados'});
            }

            const {descricao} = req.body;

            if (!descricao || descricao.length < 2) {
                return res.status(400).json({error : 'Descricao nao e valida'});
            }
    
            if (!req.file || !req.file.originalname) {
                return res.status(400).json({error : 'A imagem é obrigatoria'});
            }

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario : usuario.id,
                descricao,
                foto: image.media.url,
                data: new Date()


            }
            
            await PublicacaoModel.create(publicacao);

            usuario.posts++;
            await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);

            return res.status(200).json({error : 'Post criado com sucesso'});

        }catch(e){
            return res.status(400).json({error : 'Informacao nao e valida'});
        }

        

    });

    export const config = {
        api : {
            bodyParser : false
        }
    }

    export default corsPolicy(validJWTToken(conectarMongoDB(handler)));