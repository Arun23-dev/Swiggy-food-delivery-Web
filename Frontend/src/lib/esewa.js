
import axiosClient  from "../Utils/axiosClient";
export async function initiateEsewaPayment({ amount, orderId, transactionId, tax_amount = "0" }) {

  const response = await axiosClient.post(
    "/api/payment/esewa/initiate",
    {
      amount,
      tax_amount,
      transactionId,
      orderId,
    }
  );

  const data = response.data;

  const form = document.createElement("form");
  form.method = "POST";
  form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

  Object.entries(data).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
}