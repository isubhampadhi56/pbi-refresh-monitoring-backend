import {Router} from 'express'
import {userLogin,getGroups} from '../../controller/users';
import {jwtValidate} from '../../middleware/authMiddleware'

const app = Router();


app.post('/login',userLogin);
app.get('/getGroups', jwtValidate,getGroups);

export {
    app as userRouter
}