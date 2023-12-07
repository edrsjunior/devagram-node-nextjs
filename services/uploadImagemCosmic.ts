import multer from "multer";
import comsmicjs from "comsmicjs";
import { createBucketClient } from '@cosmicjs/sdk';


const {CHAVE_LEITURA_SLUG,
    CHAVE_GRAVACAO_SLUG,
    CHAVE_SLUG,} = process.env;

    

// Authenticate
const bucketDevagram = createBucketClient({
  bucketSlug: CHAVE_SLUG as string,
  readKey: CHAVE_LEITURA_SLUG as string,
  writeKey: CHAVE_GRAVACAO_SLUG as string,
});


const storage = multer.memoryStorage();
const upload = multer({storage : storage});

const uploadImagemCosmic = async(req: any) =>{
    if (req?.file?.originalmame) {
        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        if (req.url && req.url.includes('publicacao')) {
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "publicacoes",
            });
        }
        else{
            return await bucketDevagram.media.insertOne({
                media: media_object,
                folder: "avatares",
            });
        }
    }
}

export {upload, uploadImagemCosmic};