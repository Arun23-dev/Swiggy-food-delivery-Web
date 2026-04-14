const express = require('express');
const orderRouter = express.Router();

const {   createOrder,cancelOrder,getOrderById,getMyOrders,updateOrderStatus,reorder, } = require('../controllers/order-controller');
// const { authMiddleware } = require('../middleware/auth');

orderRouter.post('/create',  createOrder);
orderRouter.get('/:orderId/cancel', cancelOrder);
orderRouter.get('/:orderId',  getOrderById);
orderRouter.get('/my-orders', getMyOrders);
orderRouter.patch('/:orderId/status', updateOrderStatus);
orderRouter.post('/:orderId/reorder',reorder);

module.exports = orderRouter;