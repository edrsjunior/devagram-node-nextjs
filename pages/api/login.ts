import type { NextApiHandler,NextApiRequest,NextApiResponse } from "next";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';

const endpointLogin =  (
    req: NextApiRequest,
    res: NextApiResponse<RespostaPadraoMsg>
) => {
    if (req.method === 'POST') {
        const {login, senha} = req.body; //DESESTRURACAO DE OBEJTOS ONDE CRIO DUAS VARIAVEIS CONST QUE RECEBEM OS VALORES DE LOGIN E SENHA NO req.body
        
        if (login === "admin@admin" &&
            senha === "Admin@123") {
                return res.status(200).json({msg:"Login Complete"}); 
        }
        return res.status(400).json({error:"User or passoword not found"});
            
    }
    return res.status(405).json({error:"Metodo informado not allowed"});
}

export default conectarMongoDB(endpointLogin);