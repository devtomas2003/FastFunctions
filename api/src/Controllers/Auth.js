import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
const prisma = new PrismaClient();
const privateSigner = fs.readFileSync(path.resolve(__dirname, '..', 'keys', 'private.key'), 'utf8');

export async function DoLogin(req, res){
    if(!req.headers.authorization){
        return res.status(400).set("WWW-Authenticate", 'Basic realm="Please Provide Your IAC API Credentials"').json({
            "message": "Invalid authorization header"
        });
    }

    const b64auth = req.headers.authorization.split(' ')[1];
    if(!b64auth){
        return res.status(400).json({
            "message": "Bad authorization header format"
        });
    }

    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    const userInfo = await prisma.iAC.findFirst({
        where: {
            username: login
        },
        select: {
            password: true,
            id: true
        }
    });

    if(!userInfo){
        return res.status(401).json({
            "message": "Bad Credentials"
        });
    }

    const isPasswordValid = bcrypt.compareSync(password, userInfo.password);

    if(!isPasswordValid){
        return res.status(401).json({
            "message": "Bad Credentials"
        });
    }

    const token = jwt.sign({
        iacId: userInfo.id
    }, privateSigner, {
        expiresIn: '2h',
        algorithm: 'RS256'
    });

    res.status(200).json({
        token
    });
}