import React, { useState, useCallback,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {ShoppingCart, Trash2, Plus, Minus, Truck, Receipt,CreditCard, Zap, Package, DollarSign,} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router';
import {increaseItem,decreaseItem,removeItem,removeItemFromBackend,updateItemBackend,syncCartAfterLogin} from '../features/CartSlice';
import useDebouncedCallback from '../hooks/useDebounce';

const SWIGGY_BASE_URL = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_200,c_fit/";

const getImageUrl = (imageId) =>
  imageId ? `${SWIGGY_BASE_URL}${imageId}` : null;

const KPICard = ({ title, value, icon: Icon, bgColor, textColor }) => (
  <div className={`bg-white rounded-xl shadow-sm p-5 border-l-4 ${bgColor} hover:shadow-md transition`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
      </div>
      <div className={`${bgColor.replace('border-l-4', '').trim()} p-3 rounded-full`}>
        <Icon className={`w-6 h-6 ${textColor}`} />
      </div>
    </div>
  </div>
);

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  console.log(items);
  console.log(isAuthenticated);

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

  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1;
    dispatch(increaseItem(item));
    debouncedSync({ swiggyItemId: item.swiggyItemId, quantity: newQuantity });
  };

  const handleDecrement = (item) => {
    if (item.quantity === 1) {
      const actions = [dispatch(decreaseItem(item))];
      if (isAuthenticated) {
        actions.push(dispatch(removeItemFromBackend({ swiggyItemId: item.swiggyItemId })));
      }
      Promise.all(actions).catch((error) => {
        console.log("Error occurred: " + error.message);
      });
      return;
    }
    const newQuantity = item.quantity - 1;
    dispatch(decreaseItem(item));
    debouncedSync({ swiggyItemId: item.swiggyItemId, quantity: newQuantity });
  };

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + Math.floor(item.price / 100) * item.quantity, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 30;
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal + deliveryFee - discount;
  const freeDeliveryLeft = Math.max(0, 500 - subtotal);

  const toggleSelectItem = (swiggyItemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(swiggyItemId)) newSelected.delete(swiggyItemId);
    else newSelected.add(swiggyItemId);
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(i => i.swiggyItemId)));
    }
  };

  const deleteSelected = () => {
    if (window.confirm(`Delete ${selectedItems.size} item(s)?`)) {
      selectedItems.forEach(swiggyItemId => dispatch(removeItem({ id: swiggyItemId })));
      setSelectedItems(new Set());
    }
  };

  const kpis = [
    { title: "Total Items", value: items.length, icon: Package, bgColor: "border-blue-500", textColor: "text-blue-600" },
    { title: "Quantity", value: totalQty, icon: ShoppingCart, bgColor: "border-orange-500", textColor: "text-orange-600" },
    { title: "Subtotal", value: `₹${subtotal}`, icon: DollarSign, bgColor: "border-green-500", textColor: "text-green-600" },
    { title: "To Pay", value: `₹${total}`, icon: CreditCard, bgColor: "border-purple-500", textColor: "text-purple-600" },
  ];

  // ✅ Empty cart: show only this, no bill, no item list, no KPIs
  if (items.length === 0) {
    return (
      <div className="w-full min-h-full bg-gray-50 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {kpis.map((kpi, idx) => (
            <KPICard key={idx} {...kpi} />
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-24 h-24 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-4">
            <ShoppingCart className="w-10 h-10 text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
          <p className="text-gray-400 mt-2 mb-6">Add items from restaurants to get started</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Browse Restaurants
          </Button>
        </div>
      </div>
    );
  }

  // ✅ Cart has items: show KPIs + items list + bill
  return (
    <div className="w-full min-h-full bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpis.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* LEFT COLUMN — Item list */}
        <div className="lg:w-[70%] space-y-4">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">

            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === items.length && items.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                  />
                  Select All
                </label>
                {selectedItems.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteSelected}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete ({selectedItems.size})
                  </Button>
                )}
              </div>
              <Badge variant="secondary" className="text-xs">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={item.swiggyItemId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 flex items-start gap-4 hover:bg-gray-50 transition"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.swiggyItemId)}
                      onChange={() => toggleSelectItem(item.swiggyItemId)}
                      className="mt-2 w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />

                    {getImageUrl(item.image) ? (
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl bg-gray-100 shadow-sm"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">₹{Math.floor(item.price / 100)} each</p>
                    </div>

                    <div className="flex items-center gap-2 bg-white rounded-full border border-gray-200 px-2 py-1 shadow-sm">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="w-7 h-7 rounded-full hover:bg-orange-100 hover:text-orange-600 flex items-center justify-center"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-semibold text-gray-700 min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="w-7 h-7 rounded-full hover:bg-orange-100 hover:text-orange-600 flex items-center justify-center"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <p className="font-bold text-gray-800">₹{Math.floor(item.price / 100) * item.quantity}</p>
                      <button
                        onClick={() => {
                          if (window.confirm('Remove item?')) dispatch(removeItem({ id: item.swiggyItemId }));
                        }}
                        className="text-gray-400 hover:text-red-500 text-xs mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Bill (only rendered when items exist, guaranteed by early return above) */}
        <div className="lg:w-[30%] space-y-5">
          {freeDeliveryLeft > 0 ? (
            <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 flex items-start gap-3">
              <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  Add <span className="font-bold">₹{freeDeliveryLeft}</span> more for FREE delivery
                </p>
                <div className="w-full bg-amber-200 rounded-full h-2 mt-2">
                  <div className="bg-amber-600 h-2 rounded-full" style={{ width: `${(subtotal / 500) * 100}%` }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 rounded-xl border border-green-100 p-4 flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-600" />
              <p className="text-sm font-semibold text-green-800">🎉 Free delivery unlocked! 🎉</p>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-gray-500" /> Bill Breakdown
              </h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item total</span>
                <span className="font-medium text-gray-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery fee</span>
                {deliveryFee === 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 text-xs">Free</Badge>
                ) : (
                  <span>₹{deliveryFee}</span>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Promo discount</span>
                  <span>- ₹{discount}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-baseline pt-1">
                <span className="font-semibold text-gray-800">Total</span>
                <span className="font-bold text-xl text-orange-500">₹{total}</span>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-300"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (promoCode === 'SAVE10') setPromoApplied(true);
                    else alert('Invalid code');
                  }}
                  disabled={promoApplied}
                  className="border-orange-200 text-orange-600"
                >
                  Apply
                </Button>
              </div>
              {promoApplied && (
                <p className="text-xs text-green-600 mt-2">✅ 10% discount applied!</p>
              )}
            </div>
          </div>

          <Button
            onClick={() => navigate('/checkout')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white h-14 text-lg font-semibold rounded-xl shadow-lg flex items-center justify-between px-6"
          >
            <span>Proceed to Checkout</span>
            <Badge className="bg-white/20 text-white border-0 text-base">
              ₹{total}
            </Badge>
          </Button>
          <p className="text-center text-xs text-gray-400">
            Secure payment • No cancellation fee
          </p>
        </div>

      </div>
    </div>
  );
}

export default Cart;