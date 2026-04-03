const express = require('express');
const cartRouter = express.Router();

const { addToCart, getCart, updateQuantity, removeItem, clearCart } = require('../controllers/cart-controller');
// const { authMiddleware } = require('../middleware/auth');

cartRouter.post('/add',  addToCart);
cartRouter.get('/', getCart);
cartRouter.patch('/update/:itemId',  updateQuantity);
cartRouter.delete('/remove/:itemId', removeItem);
cartRouter.delete('/clear', clearCart);

module.exports = cartRouter;