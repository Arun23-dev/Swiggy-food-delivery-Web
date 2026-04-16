const axios = require('axios')

const { generateSignature } = require('../utils/helper/esewaSignature');
const Payment = require('../models/payment');
const Order = require('../models/order');


async function esewaInitiate(req, res) {



    const PRODUCT_CODE = "EPAYTEST";
    const { amount, tax_amount = 0, transactionId, orderId } = req.body;

    const transaction_uuid = transactionId

    const total_amount = (Number(amount) + Number(tax_amount)).toFixed(1);

    const signature = generateSignature(
        total_amount,
        transaction_uuid,
        PRODUCT_CODE
    );

    res.json({
        amount,
        tax_amount,
        total_amount,
        transaction_uuid,
        product_code: PRODUCT_CODE,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "http://localhost:5173/checkout/payment/esewa/success",
        failure_url: "http://localhost:5173/checkout/payment/esewa/failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
    });
}

async function esewaVerify(req, res) {

    const PRODUCT_CODE = "EPAYTEST";
    const transaction_uuid = req.query.transaction_uuid;
    const total_amount = Number(req.query.total_amount).toFixed(1);

    try {
        const response = await axios.get(
            `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${PRODUCT_CODE}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
        );

        const esewaData = response.data;
        console.log("esewa Data here ", esewaData);

        if (esewaData.status === 'COMPLETE') {

            const payment = await Payment.findOne({ transactionId: transaction_uuid })


            //update the payment 
            if (payment && payment.status === 'pending') {
                payment.status = 'paid';
                payment.paidAt = new Date();
                payment.gatewayData = {
                    pidx: esewaData.transaction_code,
                    amount: esewaData.total_amount,
                    statusCode: esewaData.status
                };

                await payment.save();

                //update the order here

                const order = await Order.findById(payment.order);
                if (order && order.status === 'placed') {
                    order.status = 'confirmed';
                    await order.save();
                }

                return res.json({ ...esewaData, status: 'COMPLETE' });
            }

        }
        else {
            return res.json({ status: 'FAILED', message: 'Payment not completed' });
        }
    }
    catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Verification failed" });
    }
}
module.exports = {
    esewaInitiate, esewaVerify
}
