import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
const publicSigner = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'public.key'), 'utf8');

export default async function Auth(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(400).json({ "message": "Invalid Authorization Header" });
    }

    const parts = authHeader.split(' ');
    if(parts.length !== 2){
        return res.status(400).json({ "message": "Invalid Authorization Header Size" });
    }

    const [ scheme, token ] = parts;
    if(scheme !== "Bearer"){
        return res.status(400).json({ "message": "Invalid Authorization Header Schema" });
    }

    jwt.verify(token, publicSigner, async (err, decoded) => {
        if(err){
            return res.status(401).json({ "message": "Token Time Out" });
        }

        req.iacId = decoded.iacId;
        next();
    });
}