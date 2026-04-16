const express = require('express');
const cartRouter = express.Router();
const userMiddleware=require('../middleware/userMiddleware')

const { addToCart, getCart, updateQuantity, removeItem, clearCart,syncCart } = require('../controllers/cart-controller');


cartRouter.post('/add',userMiddleware,  addToCart);
cartRouter.get('/:userId',userMiddleware, getCart);
cartRouter.patch('/update/:itemId',userMiddleware,  updateQuantity);
cartRouter.delete('/remove/:itemId',userMiddleware, removeItem);
cartRouter.delete('/clear',userMiddleware, clearCart);
cartRouter.post('/sync',userMiddleware,syncCart);

module.exports = cartRouter;