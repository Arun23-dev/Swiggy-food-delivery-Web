// pages/Success.jsx
import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import axiosClient from "../Utils/axiosClient";

export default function Success() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const hasVerified = useRef(false); // Prevent double verification in Strict Mode

  const verifyPayment = useCallback(async () => {
    // Prevent double verification
    if (hasVerified.current) return;
    hasVerified.current = true;

    try {
      const dataParam = searchParams.get("data");
      
      if (!dataParam) {
        setStatus("failed");
        setErrorMessage("No payment data found");
        return;
      }

      // Decode the base64 data
      let decodedData;
      try {
        decodedData = JSON.parse(atob(dataParam));
      } catch (parseError) {
        console.error("Failed to parse payment data:", parseError);
        setStatus("failed");
        setErrorMessage("Invalid payment data format");
        return;
      }

      const { transaction_uuid, total_amount, product_code, ref_id } = decodedData;

      // Validate required fields
      if (!transaction_uuid || !total_amount) {
        setStatus("failed");
        setErrorMessage("Missing transaction information");
        return;
      }

    

      // Set timeout to prevent infinite loading
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const result = await axiosClient.get(
        `/api/payment/esewa/verify?transaction_uuid=${transaction_uuid}&total_amount=${total_amount}`,
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      // Check response status
      if (result.data?.status === "COMPLETE") {
        setStatus("COMPLETE");
        
        // Optional: Store payment info in localStorage for recovery
        const paymentInfo = {
          transaction_uuid,
          total_amount,
          verifiedAt: new Date().toISOString(),
          product_code
        };
;
      } else {
        setStatus("failed");
        setErrorMessage(result.data?.message || "Payment verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      
      if (error.name === "AbortError") {
        setStatus("failed");
        setErrorMessage("Verification timeout. Please check your order status later.");
      } else if (error.response?.status === 404) {
        setStatus("failed");
        setErrorMessage("Payment not found. Please contact support.");
      } else if (error.response?.status === 500) {
        setStatus("failed");
        setErrorMessage("Server error. Please check your order status later.");
      } else {
        setStatus("error");
        setErrorMessage(error.response?.data?.message || "Network error. Please try again.");
      }
    }
  }, [searchParams]);

  // Run verification on mount
  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  // Handle redirect on failure with debounce to prevent multiple redirects
  useEffect(() => {
    if (status === "failed") {
      const redirectTimer = setTimeout(() => {
        navigate('/checkout/payment/esewa/failure', { 
          state: { error: errorMessage, transactionId: searchParams.get("data") }
        });
      }, 2000); // Give user time to see the error
      
      return () => clearTimeout(redirectTimer);
    }
  }, [status, errorMessage, navigate, searchParams]);

  // Verifying state with skeleton loader
  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-green-500 mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Verifying Your Payment...</h2>
          <p className="text-gray-500">Please wait while we confirm your transaction</p>
        </div>
      </div>
    );
  }

  // Success state with animations
  if (status === "COMPLETE") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform transition-all duration-500 animate-fade-in-up">
          <div className="animate-bounce-slow">
            <CheckCircleIcon className="h-24 w-24 mx-auto text-green-500 mb-4" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h1>
          <p className="text-gray-600 mb-6">Your order has been confirmed and will be processed soon</p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard/orders", { replace: true })}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              View My Orders
            </button>
            
            <button
              onClick={() => navigate("/", { replace: true })}
              className="w-full border-2 border-green-500 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transform transition-all duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <XCircleIcon className="h-24 w-24 mx-auto text-red-500 mb-4" />
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed ❌</h1>
          <p className="text-gray-600 mb-4">{errorMessage || "Your payment could not be processed"}</p>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> If money was deducted from your account, it will be refunded within 3-5 business days.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/checkout", { replace: true })}
              className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-700 transition-all duration-200 shadow-lg"
            >
              Try Again
            </button>
            
            <button
              onClick={() => navigate("/support", { replace: true })}
              className="w-full border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <ExclamationTriangleIcon className="h-24 w-24 mx-auto text-yellow-500 mb-4" />
        
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Verification Error ⚠️</h1>
        <p className="text-gray-600 mb-6">{errorMessage || "Something went wrong while verifying your payment"}</p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all duration-200"
          >
            Retry Verification
          </button>
          
          <button
            onClick={() => navigate("/", { replace: true })}
            className="w-full border-2 border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
}