const express = require('express');
const orderRouter = express.Router();
const userMiddleware=require('../middleware/userMiddleware')

const {   createOrder,cancelOrder,getOrderById,getMyOrders,updateOrderStatus,reorder,getOrderByTransactionId } = require('../controllers/order-controller');


orderRouter.post('/', userMiddleware, createOrder);
orderRouter.patch('/:orderId/cancel', userMiddleware,cancelOrder);
orderRouter.get('/',userMiddleware, getMyOrders);
orderRouter.get('/:orderId', userMiddleware, getOrderById);

orderRouter.patch('/:orderId/status',userMiddleware, updateOrderStatus);
orderRouter.post('/:orderId/reorder',userMiddleware,reorder);

orderRouter.get('/by-transaction/:transactionId',getOrderByTransactionId)

module.exports = orderRouter;