// pages/Success.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const dataParam = searchParams.get("data");
        if (!dataParam) {
          navigate('/checkout/payment/esewa/failure');
          return;
        }

        const decodedData = JSON.parse(atob(dataParam));
        const { transaction_uuid, total_amount } = decodedData;

        // Verify with backend
        const response = await fetch(
          `http://localhost:3000/api/payment/esewa/verify?transaction_uuid=${transaction_uuid}&total_amount=${total_amount}`
        );
        const result = await response.json();

        if (result.status === "COMPLETE") {
          // Fetch order details using transaction_uuid
          const orderResponse = await fetch(
            `http://localhost:3000/api/order/by-transaction/${transaction_uuid}`
          );
          const orderData = await orderResponse.json();
          setOrderDetails(orderData);
          setStatus("success");

          // Optional: Save order data to global state/context here
          // e.g., useOrderContext().setLastOrder(orderData)
        } else {
          setStatus("failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  // Verifying state
  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700">Verifying Payment...</h2>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircleIcon className="h-20 w-20 mx-auto text-green-500" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">Your order has been confirmed</p>

          {orderDetails && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">Order ID: <span className="font-semibold">{orderDetails._id}</span></p>
              <p className="text-sm text-gray-600 mt-1">Amount Paid: <span className="font-semibold">₹{orderDetails.totalAmount}</span></p>
              <p className="text-sm text-gray-600 mt-1">Transaction ID: <span className="font-semibold">{orderDetails.transactionId}</span></p>
            </div>
          )}

          <button
            onClick={() => navigate("/dashboard/order")}
            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full mt-3 border border-green-500 text-green-500 py-3 rounded-lg font-semibold hover:bg-green-50"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Failed state – redirect to failure page
  if (status === "failed") {
    navigate('/checkout/payment/esewa/failure');
    return null;
  }

  // Error state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-yellow-600 mb-2">Verification Error</h1>
        <button onClick={() => navigate("/")} className="w-full bg-blue-500 text-white py-3 rounded-lg">
          Go Home
        </button>
      </div>
    </div>
  );
}