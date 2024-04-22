import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function CreateFastFunction(req, res){
    const functionName = req.body.functionName;

    if(!functionName){
        return res.status(400).json({
            "message": "Function name is missing"
        });
    }

    const createdBy = req.iacId.split(":")[req.iacId.split(":").length-1];
    const srn = "srn:slabs:fastfunctions:" + createdBy + ":" + new Date().getTime() + "-" + functionName;
    
    await prisma.functionsMetadata.create({
        data: {
            name: functionName,
            id: srn,
            IAC: {
                connect: {
                    id: req.iacId
                }
            }
        }
    });

    await prisma.functionsWorkspace.create({
        data: {
            name: "main.js",
            id: srn + ":main.js",
            FunctionsMetadata: {
                connect: {
                    id: srn
                }
            },
            code: "console.log('hello world');"
        }
    });
    
    res.status(200).json({
        srn
    });
}