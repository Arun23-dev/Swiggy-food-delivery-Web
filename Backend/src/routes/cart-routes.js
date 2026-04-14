const express = require('express');
const cartRouter = express.Router();

const { addToCart, getCart, updateQuantity, removeItem, clearCart,syncCart } = require('../controllers/cart-controller');
// const { authMiddleware } = require('../middleware/auth');

cartRouter.post('/add',  addToCart);
cartRouter.get('/:userId', getCart);
cartRouter.patch('/update/:itemId',  updateQuantity);
cartRouter.delete('/remove/:itemId', removeItem);
cartRouter.delete('/clear', clearCart);
cartRouter.post('/sync',syncCart);

module.exports = cartRouter;