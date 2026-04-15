const {generateSignature}=require('../utils/helper/esewaSignature')


async function esewaInitiate(req, res) {

    const PRODUCT_CODE = "EPAYTEST";
    const { amount, tax_amount = 0 } = req.body;

    const transaction_uuid = crypto.randomUUID();

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
        success_url: "http://localhost:5173/checkout/payment/success",
        failure_url: "http://localhost:5173/checkout/payment/failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
    });
}

async function esewaVerify(req, res) {

    console.log("Here in the verify man lets do it man ");

      const PRODUCT_CODE = "EPAYTEST";

    const transaction_uuid = req.query.transaction_uuid;
    const total_amount = Number(req.query.total_amount).toFixed(1);

    try {
        const response = await axios.get(
            `https://rc.esewa.com.np/api/epay/transaction/status/?product_code=${PRODUCT_CODE}&total_amount=${total_amount}&transaction_uuid=${transaction_uuid}`
        );

        res.json(response.data);
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).json({ error: "Verification failed" });
    }
}

module.exports = {
    esewaInitiate, esewaVerify
}
