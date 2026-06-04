const express = require('express');
const paymentRouter = express.Router();
const userMiddleware=require('../middleware/userMiddleware')

const { esewaInitiate,esewaVerify,getMyPayment } = require('../controllers/payment-controller');

paymentRouter.post('/esewa/initiate', esewaInitiate);
paymentRouter.get('/esewa/verify',esewaVerify);
paymentRouter.get('/',userMiddleware,getMyPayment);

module.exports = paymentRouter;

