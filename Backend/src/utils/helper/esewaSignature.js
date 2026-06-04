const crypto = require("crypto");

function generateSignature(total_amount, transaction_uuid, product_code) {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
  
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const hash = crypto.createHmac("sha256", secretKey).update(message).digest("base64");
  return hash;
}

module.exports = { generateSignature }; 