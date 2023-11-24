import type { NextApiHandler,NextApiRequest,NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from "../../models/userModel";

const endpointLogin =  async (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if (req.method === 'POST') {
        const {login, senha} = req.body; //DESESTRURACAO DE OBEJTOS ONDE CRIO DUAS VARIAVEIS CONST QUE RECEBEM OS VALORES DE LOGIN E SENHA NO req.body
        
        const usersFind = await UsuarioModel.find({email : login, senha: md5(senha)});


        if (usersFind && usersFind.length > 0) {
                const userFounded = usersFind[0];
                return res.status(200).json({msg:`Hello, ${userFounded.nome} login complete with success`}); 
        }
        return res.status(400).json({error:"User or passoword not found"});
            
    }
    return res.status(405).json({error:"Metodo informado not allowed"});
}

export default conectarMongoDB(endpointLogin);