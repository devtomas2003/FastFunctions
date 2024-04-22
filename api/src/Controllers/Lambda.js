import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import Queue from "../libs/Queue";

export async function CreateFastFunction(req, res){
    const functionName = req.body.functionName;
    const gitPath = req.body.gitPath;

    if(!functionName){
        return res.status(400).json({
            "message": "Function name is missing"
        });
    }

    if(!gitPath){
        return res.status(400).json({
            "message": "Git Path is missing"
        });
    }

    const createdBy = req.iacId.split(":")[req.iacId.split(":").length-1];
    const srn = "srn:slabs:fastfunctions:" + createdBy + ":" + new Date().getTime() + "-" + functionName;
    
    await prisma.functionsMetadata.create({
        data: {
            name: functionName,
            id: srn,
            gitPath,
            IAC: {
                connect: {
                    id: req.iacId
                }
            }
        }
    });

    await Queue.add('CloneRepo', { gitPath });

    res.status(200).json({
        srn,
        "message": "Function created successfully. In background we are clonning your repo. Please check the status!"
    });
}