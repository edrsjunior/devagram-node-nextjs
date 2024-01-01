import type{ NextApiRequest, NextApiResponse } from "next";
import { validJWTToken } from "../../middlewares/validJWTToken";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { UsuarioModel } from "../../models/userModel";
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from "../../services/uploadImagemCosmic";
import { corsPolicy } from "../../middlewares/corsPolicy";

const handler = nc()
    .use(upload.single('file'))
    .put(async(req: any, res : NextApiResponse<RespostaPadraoMsg>) =>{
        try {
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);

            if (!usuario) {
                return res.status(400).json({error : 'Usuario not found'});
            }

            const {nome} = req.body;
            if (nome && nome.length > 2) {
                usuario.nome = nome;
            }

            const {file} = req;
            if (file && file.originalname) {
                const image = await uploadImagemCosmic(req);
                if (image && image.media && image.media.url) {
                    usuario.avatar = image.media.url;
                }
               
            }

            await UsuarioModel.findByIdAndUpdate({_id : usuario._id}, usuario);
            return res.status(200).json({msg : 'Usuario alterado com sucesso'});

        } catch (e) {
            console.log(e);
            return res.status(400).json({error : 'Nao foi possivel salvar o usuario'});

        }
        
    })
    .get(async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
        try {
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            usuario.senha = null;
            return res.status(200).json(usuario);
    
        } catch (e) {
            console.log(e);
            return res.status(400).json({error : 'Não foi possivel obter as informações do usuario'})
        }
    
    
        
    }

    );

export const config = {
    api : {
        bodyParser : false
    }
}

export default corsPolicy(validJWTToken(conectarMongoDB(handler))); 
/*AQUI QUE TA O PUlO DO GATO, QUANDO ESSE ENDPOINT E CHAMADO POR PADRAO ELE CHAMA O VALIDADOR DO JWT QUE PUXA O TOKEN DO HEADER E FAZ TODAS AS VALIDACOES SOMENTE SE PASSAR EM TUDO INCLUIDO A VALIDADCAO COM AS DUAS CHAVES ELE DEIXA SEGUIR */