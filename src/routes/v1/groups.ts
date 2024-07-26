import {Router} from 'express'
import {getRefreshStatus,createGroup} from '../../controller/groups'
import {jwtValidate} from '../../middleware/authMiddleware'
import { groupAuth } from '../../middleware/datasetAuth'
const app = Router();

app.use(jwtValidate)

app.get('/refreshStatus',groupAuth,getRefreshStatus)
app.post('/createGroup',createGroup)
export {
    app as projectRouter 
}