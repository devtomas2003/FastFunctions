import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';
import { zip } from 'zip-a-folder';

export default {
    key: 'CloneRepo',
    handle({ data }){
        const folderName = uuidv4();
        fs.mkdirSync(path.resolve('temp', folderName));
        
        const { exec } = require('child_process');
        const cmdCommand = `git clone ${data.gitPath}`;
        
        const cloneCommand = exec(cmdCommand, {
            cwd: path.resolve('temp', folderName)
        });
        
        cloneCommand.on('close', () => {
            const codeFolderNameEx = data.gitPath.split("/")[data.gitPath.split("/").length-1];
            const codeFolderName = codeFolderNameEx.split(".")[0];
        
            zip(path.resolve('temp', folderName, codeFolderName), path.resolve('temp', folderName + ".zip")).catch(() => {
                return res.status(404).json({
                    "message": "GitHub repository not found! Please add dev.tomas2003@gmail.com as collaborator if your repo is private.",
                });
            });
        
            fs.rmSync(path.resolve('temp', folderName), { force: true, recursive: true });
        });
        
    }
}