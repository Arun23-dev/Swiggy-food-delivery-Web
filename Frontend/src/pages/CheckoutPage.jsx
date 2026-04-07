import { useState } from "react";
import { Minus, Plus, Lock, Check } from "lucide-react";

const INIT_CART = [
  { id: 1, name: "Idli Sambar", price: 59, qty: 1 },
  { id: 2, name: "Masala Dosa", price: 89, qty: 1 },
  { id: 3, name: "Filter Coffee", price: 49, qty: 2 },
];

const DELIVERY_FEE = 67;
const GST_RATE = 0.12;

export default function CheckoutPage() {
  const [cart, setCart] = useState(INIT_CART);

  const itemTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const gst = +(itemTotal * GST_RATE).toFixed(2);
  const total = Math.round(itemTotal + gst + DELIVERY_FEE);

  const inc = (id) =>
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  const dec = (id) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))
    );

  return (
    <div className="min-h-screen bg-gray-100 font-sans">

      {/* Header */}
      <header className="sticky top-0 bg-white border-b flex justify-between items-center px-6 h-16 z-10">
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
        <button className="text-sm font-semibold">Help</button>
      </header>

      <main className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">

        {/* LEFT */}
        <section className="md:col-span-2 space-y-6">

          {/* Account */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg">Account</h2>
            <p className="text-gray-500 text-sm">Login to continue</p>
            <button className="mt-4 w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition">
              LOGIN
            </button>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg">Address</h2>
            <p className="text-gray-400 text-sm">Select delivery address</p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg">Payment</h2>
            <button className="mt-4 w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
              Pay ₹{total}
            </button>
          </div>

        </section>

        {/* RIGHT */}
        <aside className="space-y-4">

          {/* Cart */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-lg mb-4">Your Order</h2>
            {cart.map((item) => (
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
            ))}
          </div>

          {/* Bill */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold mb-3">Bill</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Items</span>
              <span>₹{itemTotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Delivery</span>
              <span>₹{DELIVERY_FEE}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>GST</span>
              <span>₹{gst}</span>
            </div>
            <div className="border-t mt-3 pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          {/* Secure */}
          <div className="bg-green-100 p-4 rounded-2xl flex items-center gap-2 text-green-700 text-sm">
            <Check size={16} /> 100% secure payments
          </div>

        </aside>
      </main>
    </div>
  );
}