

export async function initiateEsewaPayment({ amount,orderId,transactionId, tax_amount = "0" }) {


  const res = await fetch("http://localhost:3000/api/payment/esewa/initiate", {
          method: "POST",
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
             
          },
          body: JSON.stringify({ amount, tax_amount ,transactionId,orderId}),
        });

  const data = await res.json();

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