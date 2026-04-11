import React, { useState, useRef } from "react";
import axios from "axios";
import { generateUniqueId } from "../Utils/helper";

const PaymentComponent = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    productName: "",
    amount: 100,
    tax_amount: 10,
    total_amount: 110,
    product_code: "EPAYTEST",
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: "https://developer.esewa.com.np/success",
    failure_url: "https://developer.esewa.com.np/failure",
    paymentGateway: "esewa"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [esewaFormData, setEsewaFormData] = useState(null);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-calculate total amount when amount or tax changes
    if (name === "amount" || name === "tax_amount") {
      const amount = name === "amount" ? parseFloat(value) : parseFloat(formData.amount);
      const tax = name === "tax_amount" ? parseFloat(value) : parseFloat(formData.tax_amount);
      const total = (isNaN(amount) ? 0 : amount) + (isNaN(tax) ? 0 : tax);
      
      setFormData({
        ...formData,
        [name]: value,
        total_amount: total
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate unique transaction ID
      const transactionUuid = `${Date.now()}_${generateUniqueId()}`;
      
      // Update form data with transaction UUID
      const paymentData = {
        ...formData,
        transaction_uuid: transactionUuid,
        amount: parseFloat(formData.amount),
        tax_amount: parseFloat(formData.tax_amount),
        total_amount: parseFloat(formData.total_amount),
        signed_field_names: "total_amount,transaction_uuid,product_code"
      };

      // For eSewa payment
      if (formData.paymentGateway === "esewa") {
        const response = await axios.post(
          "http://localhost:5000/api/initiate-esewa-payment",
          paymentData
        );

        if (response.data.formData) {
          setEsewaFormData(response.data.formData);
          // Submit the form after state update
          setTimeout(() => {
            if (formRef.current) {
              formRef.current.submit();
            }
          }, 100);
        } else {
          console.error("Error: Payment form data is undefined.");
          alert("Payment initialization failed. Please try again.");
        }
      } 
      // For Khalti payment (if implementing)
      else if (formData.paymentGateway === "khalti") {
        alert("Khalti payment integration coming soon!");
      }
      
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert(error.response?.data?.message || "Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Payment Integration
          </h1>
          <p className="text-lg text-gray-600">
            Please fill in all the details to proceed with payment
          </p>
          <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <form className="p-8 space-y-6" onSubmit={handleSubmit}>
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                    Product/Service Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="productName"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter product/service name"
                  />
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                Payment Details
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                    Amount (NPR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    min="1"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter amount"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="tax_amount" className="block text-sm font-medium text-gray-700">
                    Tax Amount (NPR)
                  </label>
                  <input
                    type="number"
                    id="tax_amount"
                    name="tax_amount"
                    value={formData.tax_amount}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter tax amount"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700">
                    Total Amount (NPR)
                  </label>
                  <input
                    type="number"
                    id="total_amount"
                    name="total_amount"
                    value={formData.total_amount}
                    readOnly
                    disabled
                    className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                Payment Method
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="paymentGateway" className="block text-sm font-medium text-gray-700">
                    Select Payment Gateway <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="paymentGateway"
                    name="paymentGateway"
                    value={formData.paymentGateway}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="esewa">🏦 eSewa</option>
                    <option value="khalti">💳 Khalti</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-lg text-white font-semibold text-lg transition-all duration-200 transform ${
                  isSubmitting 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Proceed to Payment"
                )}
              </button>
            </div>

            {/* Security Notice */}
            <div className="text-center text-sm text-gray-500 mt-4">
              <p className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Your payment information is secure and encrypted
              </p>
            </div>
          </form>

          {/* Hidden form for eSewa submission */}
          {esewaFormData && (
            <form
              ref={formRef}
              method="POST"
              action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
              className="hidden"
            >
              {Object.entries(esewaFormData).map(([key, value]) => (
                <input
                  key={key}
                  type="hidden"
                  name={key}
                  value={value}
                  readOnly
                />
              ))}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentComponent;