const express = require('express');
const paymentRouter = express.Router();
const userMiddleware=require('../middleware/userMiddleware')

const { esewaInitiate,esewaVerify } = require('../controllers/payment-controller');

paymentRouter.post('/esewa/initiate', esewaInitiate);
paymentRouter.get('/esewa/verify', userMiddleware,esewaVerify);

module.exports = paymentRouter;

