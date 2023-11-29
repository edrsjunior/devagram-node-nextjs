import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { RespostaPadraoMsg } from "../types/RespostaPadraoMsg";
import jwt,{JwtPayload } from "jsonwebtoken";

export const validJWTToken = (handler : NextApiHandler) =>
    (req: NextApiRequest, res : NextApiResponse<RespostaPadraoMsg>) => {


        try {
            
            const {MINHA_CHAVE_JWT} = process.env;
    if (!MINHA_CHAVE_JWT) {
        return res.status(500).json({error : 'JWT ENV not finded'});
    }

    if (!req || !req.headers) {
        return res.status(401).json({error : 'Access token not valided, user not authorized'});
    }

    if (req.method !== 'OPTIONS') {
        const authorization = req.headers['authorization'];

        if (!authorization) {
            return res.status(401).json({error : 'Access token not valided, user not authorized'});
        }

        const token = authorization.substring(7);
        if (!token) {
            return res.status(401).json({error : 'Access token not valided, user not authorized'});
        }

        const decode = jwt.verify(token, MINHA_CHAVE_JWT) as JwtPayload;
        if (!decode) {
            return res.status(401).json({error : 'Access token not valided, user not authorized'});
        }

        if (!req.query) {
            req.query = {};
        }

        req.query.userId = decode._id;
    }


        } catch (error) {
            console.log(error);
            return res.status(401).json({error : 'Access token not valided, user not authorized'});
        }
    
    
    return handler(req, res);
}   