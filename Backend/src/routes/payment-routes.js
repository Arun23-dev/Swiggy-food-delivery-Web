const express = require('express');
const paymentRouter = express.Router();
const userMiddleware=require('../middleware/userMiddleware')

const { esewaInitiate,esewaVerify } = require('../controllers/payment-controller');

paymentRouter.post('/esewa/initiate',userMiddleware, esewaInitiate);
paymentRouter.get('/esewa/verify',esewaVerify);

module.exports = paymentRouter;

