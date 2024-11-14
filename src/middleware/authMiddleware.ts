import jwt from 'jsonwebtoken';
import {jwtSecret,genToken,accessToken} from '../config/config'
import { Request,Response,NextFunction } from 'express';
import axios from 'axios';
async function jwtValidate(req:Request, res:Response, next:NextFunction) {
    const bauth:string = String(req.headers['authorization']);
    // console.log(req.headers);
    if(!(bauth?.startsWith('Bearer '))){
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

async function checkTokenValidity(req:Request, res:Response, next:NextFunction) {
    try {
        const response = await axios.get('https://api.powerbi.com/v1.0/myorg/groups?%24top=1', {
            headers: {
                'Authorization':  accessToken.pbi
            }
        });
        console.log('Token is valid:', response.data);
        next();
    } catch (error: any) {
        if (error.response) {
            console.error('Token is invalid or expired');
            await genToken();
            next();
        } else {
            console.error('Error while checking token:', error.message);
            res.status(500).json({ error: `Error while checking token: ${error.message}`});
        }
    }
}
export {
    jwtValidate,
    checkTokenValidity
}