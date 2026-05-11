import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Minus, Plus, Lock, Check, ChevronRight, Home, CreditCard, Wallet, Building, Truck, Clock, Shield } from "lucide-react";
import useDebouncedCallback from '../hooks/useDebounce';
import { increaseItem, decreaseItem } from "@/features/CartSlice";
import { setAddress } from "@/features/UserSlice";
import { setRedirectURL } from "@/features/RedirectSlice";
import toast, { Toaster } from 'react-hot-toast';
import { syncCartAfterLogin, updateItemBackend, removeItemFromBackend } from '@/features/CartSlice';
import { createOrder } from "@/features/OrderSlice";
import { SWIGGY_IMAGE_BASE_URL, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from '../Utils/Constants';
import { initiateEsewaPayment } from "../lib/esewa";
import { useCartSelection } from '../hooks/useCartSelection';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { items, count } = useSelector((state) => state.cart);
  const cart = items;

  const [activeStep, setActiveStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Multi‑selection hook
  const {
    selectedCartItems,
    selectedItemTotal,
    selectedDeliveryFee,
    selectedTotal,
    toggleSelectItem,
    selectAll,
    isAllSelected,
    removeFromSelection,
  } = useCartSelection(cart);

  const addresses = user?.address;
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    street: "",
    city: "",
    pincode: ""
  });

  // Sync cart after login
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(syncCartAfterLogin({ syncType: "reconcile" }));
    }
  }, [isAuthenticated, dispatch]);

  const syncToBackend = useCallback(({ swiggyItemId, quantity }) => {
    if (isAuthenticated) {
      dispatch(updateItemBackend({ swiggyItemId, quantity }));
    }
  }, [isAuthenticated, dispatch]);

  const debouncedSync = useDebouncedCallback(syncToBackend, 1000);

  const handleIncrement = async (item) => {
    const newQuantity = item.quantity + 1;
    dispatch(increaseItem(item));
    debouncedSync({
      swiggyItemId: item.swiggyItemId,
      quantity: newQuantity
    });
  };

  const handleDecrement = async (item) => {
    if (item.quantity === 1) {
      const actions = [dispatch(decreaseItem(item))];
      if (isAuthenticated) {
        actions.push(dispatch(removeItemFromBackend({ swiggyItemId: item.swiggyItemId })));
      }
      Promise.all(actions).catch((error) => {
        console.log("Error occurred " + error.message);
      });
      // Remove from selection as item is gone
      removeFromSelection(item.swiggyItemId);
      return;
    }

    const newQuantity = item.quantity - 1;
    dispatch(decreaseItem(item));
    debouncedSync({
      swiggyItemId: item.swiggyItemId,
      quantity: newQuantity
    });
  };

  // Step navigation
  const handleLoginClick = () => {
    dispatch(setRedirectURL(location.pathname));
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

  // Add address
  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.pincode) {
      alert("Please fill all required fields");
      return;
    }
    if (!/^\d{6}$/.test(newAddress.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    const addressToSend = {
      label: newAddress.label || "Home",
      street: newAddress.street,
      city: newAddress.city,
      pincode: newAddress.pincode,
      isDefault: addresses?.length === 0
    };

    try {
      const result = await dispatch(setAddress(addressToSend));
      console.log("Address saved:", result);
      setNewAddress({
        label: "Home",
        street: "",
        city: "",
        pincode: "",
        isDefault: false
      });
      setShowAddressForm(false);
      alert("Address added successfully!");
    } catch (error) {
      console.error("Failed to save address:", error);
      alert(error.message || "Failed to save address");
    }
  };

  // Place order – uses selected items only
  const handlePlaceOrder = async () => {
    if (selectedCartItems.length === 0) {
      toast.error('Please select at least one item to order');
      return;
    }
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }
    if (selectedTotal <= 0) {
      toast.error('Invalid order total. Please check your cart.');
      return;
    }

    const orderData = {
      deliveryAddress: selectedAddress,
      items: selectedCartItems,
      totalAmount: selectedTotal,
      PaymentMode: selectedPayment
    };

    try {
      const response = await dispatch(createOrder(orderData));
      console.log(response);
      if (response?.payload?.success) {
        initiateEsewaPayment({
          orderId: response.payload.order._id,
          amount: selectedTotal,
          transactionId: response.payload.transactionId
        });
      }
    } catch (error) {
      console.log("Error Occurred", error);
    }
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
      <header className="sticky top-0 bg-white border-b flex justify-between items-center px-6 h-16 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold">
            <svg className="VXJlj" viewBox="0 0 61 61" height="49" width="49">
              <g clipPath="url(#a)">
                <path fill="#FF5200" d="M.32 30.5c0-12.966 0-19.446 3.498-23.868a16.086 16.086 0 0 1 2.634-2.634C10.868.5 17.354.5 30.32.5s19.446 0 23.868 3.498c.978.774 1.86 1.656 2.634 2.634C60.32 11.048 60.32 17.534 60.32 30.5s0 19.446-3.498 23.868a16.086 16.086 0 0 1-2.634 2.634C49.772 60.5 43.286 60.5 30.32 60.5s-19.446 0-23.868-3.498a16.086 16.086 0 0 1-2.634-2.634C.32 49.952.32 43.466.32 30.5Z"></path>
                <path fill="#fff" fillRule="evenodd" d="M32.317 24.065v-6.216a.735.735 0 0 0-.732-.732.735.735 0 0 0-.732.732v7.302c0 .414.336.744.744.744h.714c10.374 0 11.454.54 10.806 2.73-.03.108-.066.21-.102.324-.006.024-.012.048-.018.066-2.724 8.214-10.092 18.492-12.27 21.432a.764.764 0 0 1-1.23 0c-1.314-1.776-4.53-6.24-7.464-11.304-.198-.462-.294-1.542 2.964-1.542h3.984c.222 0 .402.18.402.402v3.216c0 .384.282.738.666.768a.73.73 0 0 0 .582-.216.701.701 0 0 0 .216-.516v-4.362a.76.76 0 0 0-.756-.756h-8.052c-1.404 0-2.256-1.2-2.814-2.292-1.752-3.672-3.006-7.296-3.006-10.152 0-7.314 5.832-13.896 13.884-13.896 7.17 0 12.6 5.214 13.704 11.52.006.054.048.294.054.342.288 3.096-7.788 2.742-11.184 2.76a.357.357 0 0 1-.36-.36v.006Z" clipRule="evenodd"></path>
              </g>
              <defs><clipPath id="a"><path fill="#fff" d="M.32.5h60v60h-60z"></path></clipPath></defs>
            </svg>
          </div>
          <div>
            <div className="font-black text-sm">Secure Checkout</div>
            <div className="flex items-center text-green-600 text-xs gap-1">
              <Lock size={12} /> Safe & secure
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className={`flex items-center gap-2 ${activeStep >= 1 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>1</div>
            <span className="text-sm">Account</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
          <div className={`flex items-center gap-2 ${activeStep >= 2 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>2</div>
            <span className="text-sm">Address</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
          <div className={`flex items-center gap-2 ${activeStep >= 3 ? 'text-orange-600' : 'text-gray-400'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep >= 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>3</div>
            <span className="text-sm">Payment</span>
          </div>
        </div>

        <button className="text-sm font-semibold text-gray-600 hover:text-gray-900">Help</button>
      </header>

      <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-5 gap-6 mt-4">
        {/* LEFT COLUMN */}
        <section className="md:col-span-2 space-y-4">
          {/* Step 1 Account */}
          <div className={`bg-white rounded-2xl p-4 shadow-sm transition-all ${activeStep === 1 ? 'ring-2 ring-orange-500' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === 1 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>1</div>
                <h2 className="font-semibold text-base">Account</h2>
              </div>
              {isAuthenticated && activeStep > 1 && (
                <button onClick={() => setActiveStep(1)} className="text-orange-500 text-xs hover:underline">Edit</button>
              )}
            </div>
            {!isAuthenticated ? (
              <div>
                <p className="text-gray-500 text-xs mb-3">Login to continue with your order</p>
                <button onClick={handleLoginClick} className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold text-sm hover:bg-green-700 transition">
                  LOGIN TO CONTINUE
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.firstName?.charAt(0) || user?.emailId?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-600 truncate">{user?.emailId}</p>
                </div>
                <Check size={16} className="text-green-600 flex-shrink-0" />
              </div>
            )}
          </div>

          {/* Step 2 Address & Step 3 Payment – only if authenticated */}
          {isAuthenticated && (
            <>
              <div className={`bg-white rounded-2xl p-4 shadow-sm transition-all ${activeStep === 2 ? 'ring-2 ring-orange-500' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === 2 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>2</div>
                    <h2 className="font-semibold text-base">Delivery Address</h2>
                  </div>
                  {selectedAddress && activeStep > 2 && (
                    <button onClick={() => setActiveStep(2)} className="text-orange-500 text-xs hover:underline">Edit</button>
                  )}
                </div>
                {!selectedAddress || activeStep === 2 ? (
                  <div>
                    {addresses?.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {addresses.map((addr) => (
                          <div
                            key={addr._id}
                            onClick={() => setSelectedAddress(addr)}
                            className={`border rounded-xl p-3 cursor-pointer transition-all hover:shadow-md ${selectedAddress?._id === addr._id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                          >
                            <div className="flex items-start gap-2">
                              {addr.label === 'Home' ? <Home size={16} /> : <Building size={16} />}
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className="font-semibold text-sm">{addr.label}</span>
                                  {addr.isDefault && <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">Default</span>}
                                </div>
                                <p className="text-xs text-gray-700">{addr.street}</p>
                                <p className="text-xs text-gray-500">{addr.city} - {addr.pincode}</p>
                              </div>
                              {selectedAddress?._id === addr._id && <Check size={16} className="text-orange-600" />}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {!showAddressForm ? (
                      <button onClick={() => setShowAddressForm(true)} className="w-full border-2 border-dashed border-gray-300 rounded-xl p-2 text-center text-sm hover:border-orange-500 transition">
                        + Add New Address
                      </button>
                    ) : (
                      <div className="border rounded-xl p-3 space-y-2">
                        <h3 className="font-semibold text-sm mb-1">New Address</h3>
                        <select value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} className="w-full p-1.5 text-sm border rounded-lg">
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                        <input type="text" placeholder="Street Address *" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="w-full p-1.5 text-sm border rounded-lg" />
                        <input type="text" placeholder="City *" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="w-full p-1.5 text-sm border rounded-lg" />
                        <input type="text" placeholder="Pincode *" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} className="w-full p-1.5 text-sm border rounded-lg" maxLength="6" />
                        <div className="flex gap-2">
                          <button onClick={handleAddAddress} className="flex-1 bg-orange-500 text-white py-1.5 rounded-lg font-semibold text-sm">Save</button>
                          <button onClick={() => setShowAddressForm(false)} className="flex-1 border py-1.5 rounded-lg text-sm">Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
                    {selectedAddress.label === 'Home' ? <Home size={16} /> : <Building size={16} />}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{selectedAddress.label}</p>
                      <p className="text-xs text-gray-700">{selectedAddress.street}</p>
                      <p className="text-xs text-gray-500">{selectedAddress.city} - {selectedAddress.pincode}</p>
                    </div>
                    <Check size={16} className="text-green-600" />
                  </div>
                )}
              </div>

              <div className={`bg-white rounded-2xl p-4 shadow-sm transition-all ${activeStep === 3 ? 'ring-2 ring-orange-500' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${activeStep === 3 ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}>3</div>
                  <h2 className="font-semibold text-base">Payment Method</h2>
                </div>
                <div className="space-y-2">
                  {[
                    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
                    { id: 'esewa', name: 'esewa', icon: Wallet },
                    { id: 'cod', name: 'Cash on Delivery', icon: Truck }
                  ].map((method) => (
                    <div
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`border rounded-xl p-2 cursor-pointer transition-all ${selectedPayment === method.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                    >
                      <div className="flex items-center gap-2">
                        <method.icon size={18} />
                        <span className="flex-1 font-medium text-sm">{method.name}</span>
                        {selectedPayment === method.id && <Check size={16} className="text-orange-600" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                {activeStep > 1 && (
                  <button onClick={handlePrevStep} className="flex-1 border-2 border-gray-300 py-2 rounded-xl font-semibold text-sm hover:bg-gray-50">
                    Back
                  </button>
                )}
                {activeStep < 3 ? (
                  <button onClick={handleNextStep} className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-bold text-sm hover:bg-orange-600">
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing || !selectedAddress || !selectedPayment || selectedCartItems.length === 0}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition ${isProcessing || !selectedAddress || !selectedPayment || selectedCartItems.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isProcessing ? 'Processing...' : `Place Order • ₹${selectedTotal}`}
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        {/* RIGHT COLUMN - Order Summary with selection */}
        <aside className="md:col-span-3 space-y-4 sticky top-20 h-fit">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-xl mb-5">Your Order</h2>
            {cart?.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 15v6" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <button onClick={() => navigate(-1)} className="bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition">
                  Browse Menu
                </button>
              </div>
            ) : (
              <>
                {/* Select All row */}
                <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={selectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-medium">Select All</span>
                </div>

                {cart.map((item) => (
                  <div key={item.swiggyItemId} className="mb-5 pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCartItems.some(i => i.swiggyItemId === item.swiggyItemId)}
                        onChange={() => toggleSelectItem(item.swiggyItemId)}
                        className="mt-5 w-4 h-4 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex gap-4 mb-3">
                          <img src={`${SWIGGY_IMAGE_BASE_URL}/${item.image}`} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-base">{item.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              ₹{Math.round((item.defaultPrice || item.price || 0) / 100)} each
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center ml-[112px]">
                          <div className="flex items-center border border-green-600 rounded-lg">
                            <button onClick={() => handleDecrement(item)} className="px-3 py-1.5 hover:bg-gray-100 rounded-l transition">
                              <Minus size={16} />
                            </button>
                            <span className="px-4 font-bold text-base">{item.quantity}</span>
                            <button onClick={() => handleIncrement(item)} className="px-3 py-1.5 hover:bg-gray-100 rounded-r transition">
                              <Plus size={16} />
                            </button>
                          </div>
                          <p className="font-bold text-orange-600 text-lg">
                            ₹{Math.round(((item.defaultPrice || item.price || 0) / 100) * item.quantity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {cart?.length > 0 && (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="font-bold text-lg mb-4">Bill Details</h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items Total</span>
                    <span className="font-medium">₹{Math.round(selectedItemTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">₹{selectedDeliveryFee}</span>
                  </div>
                  <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                    <span>Total Amount</span>
                    <span className="text-orange-600 text-lg">₹{selectedTotal}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-5 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-blue-700 text-sm">
                  <Clock size={18} />
                  <span>Estimated Delivery: 25-30 mins</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700 text-sm">
                  <Shield size={18} />
                  <span>Free cancellation within 5 mins</span>
                </div>
              </div>

              <div className="bg-green-100 p-5 rounded-2xl flex items-center gap-2 text-green-700 text-sm">
                <Check size={18} /> 100% secure payments
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}