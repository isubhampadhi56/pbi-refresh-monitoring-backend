import {Router} from 'express'
import { pbiTriggerRefresh,pbiRefreshSchedule,addDataset,deleteDataset } from '../../controller/dataset';
import {jwtValidate,checkTokenValidity} from '../../middleware/authMiddleware'
import { groupAuth,datasetAuth } from '../../middleware/datasetAuth';
const app = Router();
app.use(jwtValidate);

app.post('/refresh',checkTokenValidity,pbiTriggerRefresh);
app.get('/scheduleInfo', datasetAuth,groupAuth,checkTokenValidity,pbiRefreshSchedule);
app.post('/addDataset', addDataset);
app.delete('/deleteDataset', deleteDataset);

export {
    app as datasetRouter
}