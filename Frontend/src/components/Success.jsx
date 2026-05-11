// pages/Success.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import axiosClient from "../Utils/axiosClient";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const dataParam = searchParams.get("data");
        if (!dataParam) {
          setStatus("failed");
          return;
        }

        const decodedData = JSON.parse(atob(dataParam));
        const { transaction_uuid, total_amount } = decodedData;

        const result = await axiosClient.get(
          `/api/payment/esewa/verify?transaction_uuid=${transaction_uuid}&total_amount=${total_amount}`
        );

        const paymentStatus = result.data.status;

        if (paymentStatus === "COMPLETE") {
          // No need to fetch order details – just mark success
          setStatus(paymentStatus);
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

  // Redirect on failure
  useEffect(() => {
    if (status === "failed") {
      navigate('/checkout/payment/esewa/failure');
    }
  }, [status, navigate]);

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