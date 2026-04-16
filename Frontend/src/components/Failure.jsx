// pages/Failure.jsx
import React from 'react';
import { useNavigate } from 'react-router';

function Failure() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">😞</div>
        <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed!</h1>
        <p className="text-gray-600 mb-4">Your payment could not be processed</p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">
            Possible reasons:
            <br />• Insufficient balance
            <br />• Transaction cancelled
            <br />• Technical error
          </p>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600"
        >
          Try Payment Again
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 border border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:bg-gray-50"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default Failure;