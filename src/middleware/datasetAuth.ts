import { Request, Response,NextFunction } from 'express';
import { dbClient } from '../config/config';

async function groupAuth(req:Request, res:Response, next: NextFunction){
    const groupId = req.body.groupId || req.query.groupId;
    try{
        const userInfo = await dbClient.user.findUnique({
            where: { id: req.body.userId,
                groups:{
                    has:groupId
                }
            }
        })
        console.log(userInfo);
        if(!userInfo){
            res.status(403).json({message: `Group with ID ${groupId} not found`});
        }else{
            next();
        }
    }catch(error){
        res.status(500).json({message: "unauthorized to access the group"});
        return;
    }
}

async function datasetAuth(req:Request, res:Response, next: NextFunction){
    const datasetId = req.body.datasetId;
    try{
        const groupInfo = await dbClient.group.findUnique({
            where: { id: req.body.groupId,
                datasets:{
                    has:datasetId
                }
            }
        })
        if(!groupInfo){
            res.status(403).json({message: `Dataset with ID ${datasetId} not found`});
        }else{
            next();
        }
    }catch(error){
        res.status(500).json({message: "unauthorized to access the dataset"});
        return;
    }
}

export{
    groupAuth,
    datasetAuth
}