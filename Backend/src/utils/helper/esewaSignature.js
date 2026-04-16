const crypto = require("crypto");

function generateSignature(total_amount, transaction_uuid, product_code) {
  const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

  
  if (!process.env.ESEWA_SECRET_KEY) {
    console.error("ERROR: ESEWA_SECRET_KEY is not set in environment!");
    throw new Error("ESEWA_SECRET_KEY missing");
  }

  
  const hash = crypto
    .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
    .update(message)
    .digest("base64");

    console.log(hash);

  return hash;
}
module.exports={
    generateSignature
}