import jwt from 'jsonwebtoken';
import {jwtSecret} from '../config/config'
import { Request,Response,NextFunction } from 'express';

async function jwtValidate(req:Request, res:Response, next:NextFunction) {
    const bauth:string = String(req.headers['authorization']);
    // console.log(req.headers);
    if(!bauth || !(bauth.startsWith('Bearer '))){
        res.status(403).json({
            message: "user not authorized"
        });
        return
    }
    const jwtToken = bauth.split(' ')[1];
    console.log(jwtToken)
    try{
        const decoded:any = jwt.verify(jwtToken, jwtSecret);
        req.body.userId = decoded.userId;
        next();
    } catch(err){
        res.status(403).json({
            message: "user not authorized"
        });
        return
    } 
}

export {
    jwtValidate
}