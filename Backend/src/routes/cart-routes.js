const express = require('express');
const cartRouter = express.Router();
const userMiddleware=require('../middleware/userMiddleware')

const {  getCart, updateQuantity, removeSelectedItem, clearCart,syncCart } = require('../controllers/cart-controller');

cartRouter.get('/',userMiddleware, getCart);
cartRouter.patch('/item/:itemId',userMiddleware,  updateQuantity);
cartRouter.delete('/selectedItems',userMiddleware, removeSelectedItem);
cartRouter.delete('/clear',userMiddleware, clearCart);
cartRouter.post('/sync',userMiddleware,syncCart);

module.exports = cartRouter;