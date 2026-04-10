const express = require('express');
const { register, login, logout, checkAuth,  addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,    
    setDefaultAddress } = require('../controllers/user-controller');
const userRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');


//user signup
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', userMiddleware, logout);
userRouter.get('/me', userMiddleware, checkAuth)


// address we can have max 3 address one is home , office then another anything so 

userRouter.patch('/address', userMiddleware, addAddress);
userRouter.get('/address', userMiddleware, getAddresses);
userRouter.patch('/address/:addressId', userMiddleware, updateAddress);
userRouter.delete('/address/:addressId', userMiddleware, deleteAddress);


module.exports = userRouter;

