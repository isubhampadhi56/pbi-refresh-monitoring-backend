import {getAzureADToken} from "../pkg/ad"
let accessToken = "";
const genToken = async () => {
    accessToken = await getAzureADToken();
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