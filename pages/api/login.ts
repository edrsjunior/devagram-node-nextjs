import type { NextApiHandler,NextApiRequest,NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type { LoginResposta } from "../../types/LoginResposta";
import md5 from 'md5';
import { UsuarioModel } from "../../models/userModel";
import jwt from 'jsonwebtoken';


const endpointLogin =  async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg | LoginResposta>
) => {

    const {MINHA_CHAVE_JWT} = process.env;

    if(!MINHA_CHAVE_JWT){
        return res.status(500).json({error:'ENV JWT not sended'});
    }

    if (req.method === 'POST') {
        const {login, senha} = req.body; //DESESTRURACAO DE OBEJTOS ONDE CRIO DUAS VARIAVEIS CONST QUE RECEBEM OS VALORES DE LOGIN E SENHA NO req.body
        
        const usersFind = await UsuarioModel.find({email : login, senha: md5(senha)});


        if (usersFind && usersFind.length > 0) {

                const userFounded = usersFind[0];

                const token = jwt.sign({_id: userFounded.id}, MINHA_CHAVE_JWT);

                return res.status(200).json({nome: userFounded.nome, email: userFounded.email, token}); 
        }
        return res.status(400).json({error:"User or passoword not found"});
            
    }
    return res.status(405).json({error:"Metodo informado not allowed"});
}

export default conectarMongoDB(endpointLogin);