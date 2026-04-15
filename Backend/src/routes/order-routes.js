const express = require('express');
const orderRouter = express.Router();
const userMiddleware=require('../middleware/userMiddleware')

const {   createOrder,cancelOrder,getOrderById,getMyOrders,updateOrderStatus,reorder, } = require('../controllers/order-controller');
// const { authMiddleware } = require('../middleware/auth');

orderRouter.post('/create', userMiddleware, createOrder);
orderRouter.get('/:orderId/cancel', userMiddleware,cancelOrder);
orderRouter.get('/:orderId', userMiddleware, getOrderById);
orderRouter.get('/my-orders',userMiddleware, getMyOrders);
orderRouter.patch('/:orderId/status',userMiddleware, updateOrderStatus);
orderRouter.post('/:orderId/reorder',userMiddleware,reorder);

module.exports = orderRouter;