import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import mongoose, { mongo } from "mongoose";
import type {RespostaPadraoMsg} from '../types/RespostaPadraoMsg';

export const conectarMongoDB = (handler:NextApiHandler) =>
    async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
    //IF ALREADY CONNECTED GO TO ENDPOINT OR NEXT MIDDLEWARE

    if (mongoose.connections[0].readyState) {
        return handler(req,res);
    }

    //IF NOT CONNECTED, THEN CONNECT
    const {DB_CONEXAO_STRING} = process.env;

    //IF EMPTY
    if(!DB_CONEXAO_STRING){
        return res.status(500) .json({error: 'ENV config of BD is not configured'});
    }

    mongoose.connection.on('coonected',()=> console.log('DataBase is now connected'));
    mongoose.connection.on('error', error => console.log(`DataBase error: ${error}`));
    await mongoose.connect(DB_CONEXAO_STRING);
    return handler(req,res);
}
