const express = require('express');
const { register, login, logout, checkAuth,  addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,    
    setDefaultAddress } = require('../controllers/user-controller');
    
const userRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');

userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.post('/logout', userMiddleware, logout);
userRouter.get('/me', userMiddleware, checkAuth)
userRouter.post('/address', userMiddleware, addAddress);
userRouter.get('/address', userMiddleware, getAddresses);
userRouter.put('/address/:addressId', userMiddleware, updateAddress);
userRouter.delete('/address/:addressId', userMiddleware, deleteAddress);
userRouter.patch('/address/:addressId/default',userMiddleware,setDefaultAddress)
module.exports = userRouter;

