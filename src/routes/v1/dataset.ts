import {Router} from 'express'
import { pbiTriggerRefresh,pbiRefreshSchedule,addDataset,deleteDataset } from '../../controller/dataset';
import {jwtValidate} from '../../middleware/authMiddleware'
import { groupAuth,datasetAuth } from '../../middleware/datasetAuth';
const app = Router();
app.use(jwtValidate);

app.post('/refresh',pbiTriggerRefresh);
app.get('/scheduleInfo', datasetAuth,groupAuth,pbiRefreshSchedule);
app.post('/addDataset', addDataset);
app.delete('/deleteDataset', deleteDataset);

export {
    app as datasetRouter
}