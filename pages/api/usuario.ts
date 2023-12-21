import type{ NextApiRequest, NextApiResponse } from "next";
import { validJWTToken } from "../../middlewares/validJWTToken";
import { conectarMongoDB } from "../../middlewares/conectaMongoDB";
import type { RespostaPadraoMsg } from "../../types/RespostaPadraoMsg";
import { UsuarioModel } from "../../models/userModel";

const usuarioEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
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

export default validJWTToken(conectarMongoDB(usuarioEndpoint)); 
/*AQUI QUE TA O PUlO DO GATO, QUANDO ESSE ENDPOINT E CHAMADO POR PADRAO ELE CHAMA O VALIDADOR DO JWT QUE PUXA O TOKEN DO HEADER E FAZ TODAS AS VALIDACOES SOMENTE SE PASSAR EM TUDO INCLUIDO A VALIDADCAO COM AS DUAS CHAVES ELE DEIXA SEGUIR */