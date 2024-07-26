import express from 'express';
import { mainRouter } from './routes';
import 'dotenv/config'
import cors from 'cors';
import { genToken } from './config/config';
const app = express();
const PORT = '3000';
app.use(cors());
app.use(express.json());
app.use(mainRouter);
(async() => {genToken();})();
app.listen(PORT, ()=>{
    console.log(`Started Server on port ${PORT}`);
})