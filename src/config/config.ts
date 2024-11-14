import {getAzureADToken} from "../pkg/ad"
const accessToken = {
    pbi:"",
};
const genToken = async () => {
    accessToken.pbi = await getAzureADToken();
    console.log(accessToken);
}
const jwtSecret:string = String(process.env.JWT_SECRET)
import { PrismaClient } from '@prisma/client';

const dbClient = new PrismaClient();

export {
    accessToken,
    genToken,
    dbClient,
    jwtSecret
}