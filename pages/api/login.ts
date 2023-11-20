import type { NextApiHandler,NextApiRequest,NextApiResponse } from "next";

export default (
    req: NextApiRequest,
    res: NextApiResponse
) => {
    if (req.method === 'POST') {
        const {login, senha} = req.body; //DESESTRURACAO DE OBEJTOS ONDE CRIO DUAS VARIAVEIS CONST QUE RECEBEM OS VALORES DE LOGIN E SENHA NO req.body
        return res.status(200);     
    }
    return res.status(405).json({erro:"Metodo informado not allowed"});
}