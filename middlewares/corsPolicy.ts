import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import type { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";
import NextCors from "nextjs-cors";

export const corsPolicy = (handler : NextApiHandler) => 
    async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {
        try {
            await NextCors(req, res, {
                origin : '*',
                methods : ['GET','POST','PUT'],
                optionsSuccessStatus: 200 //EVITAR ERROS EM NAVEGADORES ANTIGOS
            });

            return handler(req, res);
        } catch (e) {
            console.log(e);
            res.status(500).json({error : 'Ocorrou um erro relacionado a politica de CORS'});
        }
    }