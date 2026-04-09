import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, Lock, Check, ChevronRight, Home, MapPin, CreditCard, Wallet, Building, Truck, Clock, Shield, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const INIT_CART = [
  { id: 1, name: "Idli Sambar", price: 59, qty: 1 },
  { id: 2, name: "Masala Dosa", price: 89, qty: 1 },
  { id: 3, name: "Filter Coffee", price: 49, qty: 2 },
];

const DELIVERY_FEE = 67;
const GST_RATE = 0.12;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { AuthUI } = useAuth();
  
  const [cart, setCart] = useState(INIT_CART);
  const [activeStep, setActiveStep] = useState(1); // 1: Account, 2: Address, 3: Payment
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Saved addresses (would come from backend)
  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      type: "Home",
      address: "123 Main Street, Sector 12, Rohini",
      landmark: "Near City Mall",
      city: "Delhi",
      pincode: "110085",
      isDefault: true
    },
    {
      id: 2,
      type: "Office",
      address: "456 Business Park, Cyber City",
      landmark: "Building B, 3rd Floor",
      city: "Gurgaon",
      pincode: "122002",
      isDefault: false
    }
  ]);

  const [newAddress, setNewAddress] = useState({
    type: "Home",
    address: "",
    landmark: "",
    city: "",
    pincode: ""
  });

  const itemTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const gst = +(itemTotal * GST_RATE).toFixed(2);
  const total = Math.round(itemTotal + gst + DELIVERY_FEE);

  // Check authentication status
  useEffect(() => {
    if (!isAuthenticated && activeStep === 1) {
      // Stay on account step
      return;
    }
  }, [isAuthenticated, activeStep]);

  const inc = (id) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  
  const dec = (id) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))
    );

  const handleLoginClick = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleNextStep = () => {
    if (activeStep === 1 && !isAuthenticated) {
      handleLoginClick();
      return;
    }
    if (activeStep === 2 && !selectedAddress) {
      alert("Please select a delivery address");
      return;
    }
    if (activeStep === 3 && !selectedPayment) {
      alert("Please select a payment method");
      return;
    }
    setActiveStep(prev => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setActiveStep(prev => Math.max(prev - 1, 1));
  };

  const handleAddAddress = () => {
    if (!newAddress.address || !newAddress.city || !newAddress.pincode) {
      alert("Please fill all required fields");
      return;
    }
    
    const address = {
      id: savedAddresses.length + 1,
      ...newAddress,
      isDefault: false
    };
    
    setSavedAddresses([...savedAddresses, address]);
    setSelectedAddress(address);
    setShowAddressForm(false);
    setNewAddress({
      type: "Home",
      address: "",
      landmark: "",
      city: "",
      pincode: ""
    });
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setOrderPlaced(true);
      
      // Clear cart after order
      setCart([]);
      
      // Show success message
      setTimeout(() => {
        navigate('/order-success', { 
          state: { 
            orderId: `ORD${Date.now()}`,
            total: total,
            items: cart
          }
        });
      }, 1500);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Your order has been confirmed and will be delivered soon.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Header */}
      <header className="sticky top-0 bg-white border-b flex justify-between items-center px-6 h-16 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
            S
          </div>
          <div>
            <div className="font-black text-sm">Secure Checkout</div>
            <div className="flex items-center text-green-600 text-xs gap-1">
              <Lock size={12} /> Safe & secure
            </div>
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm">Account</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
          <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-sm">Address</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
          <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="text-sm">Payment</span>
          </div>
        </div>
        
        <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">Help</button>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">

        {/* LEFT COLUMN - Steps */}
        <section className="md:col-span-2 space-y-6">

          {/* Step 1: Account */}
          <div className={`bg-white rounded-2xl p-5 shadow-sm transition-all ${activeStep === 1 ? 'ring-2 ring-orange-500' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep === 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <h2 className="font-bold text-lg">Account</h2>
              </div>
              {isAuthenticated && activeStep > 1 && (
                <button onClick={() => setActiveStep(1)} className="text-orange-500 text-sm hover:underline">
                  Edit
                </button>
              )}
            </div>
            
            {!isAuthenticated ? (
              <div>
                <p className="text-gray-500 text-sm mb-4">Login to continue with your order</p>
                <button 
                  onClick={handleLoginClick}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition"
                >
                  LOGIN TO CONTINUE
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.firstName?.charAt(0) || user?.emailId?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-600">{user?.emailId}</p>
                </div>
                <Check size={20} className="text-green-600 ml-auto" />
              </div>
            )}
          </div>

          {/* Step 2: Address */}
          <div className={`bg-white rounded-2xl p-5 shadow-sm transition-all ${activeStep === 2 ? 'ring-2 ring-orange-500' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep === 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <h2 className="font-bold text-lg">Delivery Address</h2>
              </div>
              {selectedAddress && activeStep > 2 && (
                <button onClick={() => setActiveStep(2)} className="text-orange-500 text-sm hover:underline">
                  Edit
                </button>
              )}
            </div>
            
            {!selectedAddress || activeStep === 2 ? (
              <div>
                {/* Saved Addresses */}
                {savedAddresses.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr)}
                        className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedAddress?.id === addr.id 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {addr.type === 'Home' ? <Home size={20} /> : <Building size={20} />}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold">{addr.type}</span>
                              {addr.isDefault && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Default</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{addr.address}</p>
                            {addr.landmark && <p className="text-xs text-gray-500">Landmark: {addr.landmark}</p>}
                            <p className="text-xs text-gray-500">{addr.city} - {addr.pincode}</p>
                          </div>
                          {selectedAddress?.id === addr.id && <Check size={20} className="text-orange-600" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Add New Address Button */}
                {!showAddressForm ? (
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-orange-500 transition"
                  >
                    + Add New Address
                  </button>
                ) : (
                  <div className="border rounded-xl p-4 space-y-3">
                    <h3 className="font-semibold mb-2">New Address</h3>
                    <select
                      value={newAddress.type}
                      onChange={(e) => setNewAddress({...newAddress, type: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    >
                      <option value="Home">Home</option>
                      <option value="Office">Office</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Address *"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Landmark (Optional)"
                      value={newAddress.landmark}
                      onChange={(e) => setNewAddress({...newAddress, landmark: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({...newAddress, pincode: e.target.value})}
                      className="w-full p-2 border rounded-lg"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddAddress}
                        className="flex-1 bg-orange-500 text-white py-2 rounded-lg font-semibold"
                      >
                        Save Address
                      </button>
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 border py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                {selectedAddress.type === 'Home' ? <Home size={20} /> : <Building size={20} />}
                <div>
                  <p className="font-semibold">{selectedAddress.type}</p>
                  <p className="text-sm text-gray-700">{selectedAddress.address}</p>
                  <p className="text-xs text-gray-500">{selectedAddress.city} - {selectedAddress.pincode}</p>
                </div>
                <Check size={20} className="text-green-600 ml-auto" />
              </div>
            )}
          </div>

          {/* Step 3: Payment */}
          <div className={`bg-white rounded-2xl p-5 shadow-sm transition-all ${activeStep === 3 ? 'ring-2 ring-orange-500' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep === 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <h2 className="font-bold text-lg">Payment Method</h2>
              </div>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                { id: 'upi', name: 'UPI', icon: Wallet },
                { id: 'cod', name: 'Cash on Delivery', icon: Truck }
              ].map((method) => (
                <div
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`border rounded-xl p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedPayment === method.id 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <method.icon size={24} />
                    <span className="flex-1 font-medium">{method.name}</span>
                    {selectedPayment === method.id && <Check size={20} className="text-orange-600" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {activeStep > 1 && (
              <button
                onClick={handlePrevStep}
                className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50"
              >
                Back
              </button>
            )}
            {activeStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedAddress || !selectedPayment}
                className={`flex-1 py-3 rounded-xl font-bold transition ${
                  isProcessing || !selectedAddress || !selectedPayment
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isProcessing ? 'Processing...' : `Place Order • ₹${total}`}
              </button>
            )}
          </div>

        </section>

        {/* RIGHT COLUMN - Order Summary */}
        <aside className="space-y-4 sticky top-20 h-fit">

          {/* Cart Items */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Your Order</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Your cart is empty</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                  </div>
                  <div className="flex items-center border border-green-600 rounded-lg">
                    <button onClick={() => dec(item.id)} className="px-2 hover:bg-gray-100 rounded-l">
                      <Minus size={14} />
                    </button>
                    <span className="px-3 font-bold">{item.qty}</span>
                    <button onClick={() => inc(item.id)} className="px-2 hover:bg-gray-100 rounded-r">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bill Details */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold mb-3">Bill Details</h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Items Total</span>
              <span>₹{itemTotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Delivery Fee</span>
              <span>₹{DELIVERY_FEE}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">GST (12%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-bold">
              <span>Total Amount</span>
              <span className="text-orange-600">₹{total}</span>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-blue-50 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Clock size={16} />
              <span>Estimated Delivery: 25-30 mins</span>
            </div>
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <Shield size={16} />
              <span>Free cancellation within 5 mins</span>
            </div>
          </div>

          {/* Secure Payment Badge */}
          <div className="bg-green-100 p-4 rounded-2xl flex items-center gap-2 text-green-700 text-sm">
            <Check size={16} /> 100% secure payments
          </div>

        </aside>
      </main>
    </div>
  );
}