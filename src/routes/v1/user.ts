import {Router} from 'express'
import {userLogin,getGroups, isAuthenticated} from '../../controller/users';
import {jwtValidate} from '../../middleware/authMiddleware'

const app = Router();


app.post('/login',userLogin);
app.get('/getGroups', jwtValidate,getGroups);
app.get('/me',jwtValidate,isAuthenticated);
export {
    app as userRouter
}