import { dbClient, jwtSecret } from "../config/config";
import { Request,Response } from "express";
import jwt from 'jsonwebtoken';

async function getGroups(req:Request, res:Response){
    let groupIds: any[] = []
    try{
        const userDetails:any = await dbClient.user.findFirst({
            where:{
                id: req.body.userId
            }
        })
        groupIds = userDetails.groups;
    }catch(error){
        res.status(404).json({message: "user has not assigned any groups"});
        return
    }
    try{
        const groups = await dbClient.group.findMany({
            where: {
                id: {
                  in: groupIds
                }
              },
            select: {
                id: true,
                name: true,
                imageUrl: true,
            }
        });
        res.json(groups);
    }catch(error){
        res.status(500).json({message: "unable to fetch groups"})
    }
}

async function userLogin(req: Request, res: Response){
    const username = req.body.username
    const password = req.body.password
    try{
        const userDetail = await dbClient.user.findUnique({
            where:{
                username: username,
                password: password,
            }
        })
        if(!userDetail){
            res.status(404).json({message: "invalid username or password"})
            return
        }
        const token = jwt.sign({
            userId: userDetail.id,
        },jwtSecret)
        console.log(token)
        res.setHeader('Authorization', 'Bearer ' + token)
        res.json({message: "login successful"});
    }catch(err){
        res.status(500).json({message: err});
    }
}

export{
    userLogin,
    getGroups
}