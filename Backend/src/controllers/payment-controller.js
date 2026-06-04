const axios = require('axios')
const { generateSignature } = require('../utils/helper/esewaSignature');
const Payment = require('../models/payment');
const Order = require('../models/order');


async function esewaInitiate(req, res) {
    const product_code = "EPAYTEST";
    const { amount, tax_amount = 0, transactionId } = req.body;
   
    const transaction_uuid = transactionId;
   
    const total_amount = (Number(amount) + Number(tax_amount))

    const signature = generateSignature(
        total_amount,        //number
        transaction_uuid,     // string
        product_code
    );

    res.json({
        amount,
        tax_amount,
        total_amount,
        transaction_uuid: transaction_uuid,
        product_code: product_code,
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: `${process.env.FRONTEND_URL}/checkout/payment/esewa/success`,
        failure_url: `${process.env.FRONTEND_URL}/checkout/payment/esewa/failure`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
    });
}

async function esewaVerify(req, res) {

    console.log("API hitted of the esewa verify");
    const PRODUCT_CODE = "EPAYTEST";
    const transaction_uuid = req.query.transaction_uuid;
    const total_amount = parseFloat(req.query.total_amount).toFixed(1);

    try {
        const response = await axios.get(
            `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${PRODUCT_CODE}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
        );

        const esewaData = response.data;
        // console.log("esewa Data here ", esewaData);

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
async function getMyPayment(req, res) {

    const userId = req.result._id;
    try {
        const paymentData = await Payment.find({ user: userId }).populate('order', 'restaurants');
        let totalPaid = 0;
        let pendingPay = 0;
        let failedPayment = 0;
        let refundedAmout = 0;
        let noOfRefund = 0
        let noofTranscationInTotalPaid = 0;
        let noOftransactioniInPendingPay = 0;
        let noofTranscationInRefunded = 0;
        let noOfFailed = 0;
        let failedAmount = 0;

        paymentData.forEach(item => {
            if (item.status === 'pending') {
                pendingPay += item.amount;
                noOftransactioniInPendingPay++;
            }
            else if (item.status === 'paid') {
                totalPaid += item.amount;
                noofTranscationInTotalPaid++;
            }
            else if (item.status === 'failed') {
                failedAmount += item.amount;
                noOfFailed++;
            }
            else {
                refundedAmout += item.amount;
                noOfRefund++;
            }

        })

        return res.status(200).json({
            data: {
                payment: paymentData,
                pending: {
                    pendingPay,
                    noOftransactioniInPendingPay
                },
                paid: {
                    totalPaid,
                    noofTranscationInTotalPaid
                },
                failed: {
                    failedAmount,
                    noOfFailed
                },
                refund: {
                    refundedAmout,
                    noOfRefund
                }

            },
            message: "payment details successful"
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message,
            message: "Failure in fetching the data "
        })
    }
}
module.exports = {
    esewaInitiate, esewaVerify, getMyPayment
}
