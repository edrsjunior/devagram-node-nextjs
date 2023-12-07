import type { NextApiRequest,NextApiResponse } from "next";
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg';
import type {CadastroUserReq} from '../../types/CadastroUserReq';
import {UsuarioModel} from '../../models/userModel';
import {conectarMongoDB} from '../../middlewares/conectaMongoDB';
import md5 from 'md5';
import { uploadImagemCosmic, upload } from "../../services/uploadImagemCosmic";
import nc from 'next-connect';

const handler = nc()
    .use()

const endpointCadastro = 
async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    
    if(req.method === 'POST'){
        const user = req.body as CadastroUserReq; //USA O TYPESCRIPT DIZENDO, OLHA DE TUDO QUE TEM NO BODY PRECISO APENAS DOS VALORES DO SCHEMA CadastroUserReq O RESTO PODE IGNORAR
        
        if (!user.nome || user.nome.length < 2) {
            return res.status(400).json({error: 'Invalid name'})
        }
        if (!user.email || user.email.length < 5
            || !user.email.includes('@')
            || !user.email.includes('.')) {
            return res.status(400).json({error: 'Invalid mail'})
        }
        if (!user.senha || user.senha.length < 8) {
            return res.status(400).json({error: 'Invalid password'})
        }

        const userWithSameMail = await UsuarioModel.find({email: user.email});
        if (userWithSameMail && userWithSameMail.length > 0) {
            return res.status(400).json({error: 'User already exist'})
        }

        const userToSave = {
            nome: user.nome,
            email: user.email,
            senha: md5(user.senha)
        }

        await  UsuarioModel.create(userToSave); //SAKVA ESSE TREM, SIM APENAS NESSA LINHA
        return res.status(200).json({msg: 'Tudo certo patrao (^_^)'})
    }
    return res.status(405).json({error:"Metodo informado not allowed"});
}

export default conectarMongoDB(endpointCadastro);