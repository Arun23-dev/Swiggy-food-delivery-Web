const express=require('express');
const {register,login,logout,checkAuth}=require('../controllers/user-controller');
const authRouter=express.Router();
const userMiddleware=require('../middleware/userMiddleware');


//user signup
authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',userMiddleware,logout);
authRouter.get('/checkAuth',userMiddleware,checkAuth)

module.exports=authRouter;

