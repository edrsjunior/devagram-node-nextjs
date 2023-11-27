import { NextApiRequest, NextApiResponse } from "next";
import { validJWTToken } from "../../middlewares/validJWTToken";

const usuarioEndpoint = (req : NextApiRequest, res : NextApiResponse) => {
    return res.status(200).json({msg : 'User authenticated with success'});
}

export default validJWTToken(usuarioEndpoint); 
/*AQUI QUE TA O PUlO DO GATO, QUANDO ESSE ENDPOINT E CHAMADO POR PADRAO ELE CHAMA O VALIDADOR DO JWT QUE PUXA O TOKEN DO HEADER E FAZ TODAS AS VALIDACOES SOMENTE SE PASSAR EM TUDO INCLUIDO A VALIDADCAO COM AS DUAS CHAVES ELE DEIXA SEGUIR */