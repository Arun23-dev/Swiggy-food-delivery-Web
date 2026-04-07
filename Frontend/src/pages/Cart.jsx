import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Trash2, Plus, Minus, Truck, Tag, Receipt } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Chicken Biryani', price: 250, quantity: 2, image: '🍗', restaurant: 'Biryani House' },
    { id: 2, name: 'Garlic Naan',     price: 40,  quantity: 3, image: '🥙', restaurant: 'Biryani House' },
    { id: 3, name: 'Raita',           price: 30,  quantity: 1, image: '🥛', restaurant: 'Biryani House' },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(prev =>
      prev
        .map(item => item.id === id ? { ...item, quantity: item.quantity + change } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id) => setCartItems(prev => prev.filter(item => item.id !== id));

  const subtotal    = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty    = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 30;
  const tax         = Math.round(subtotal * 0.05);
  const total       = subtotal + deliveryFee + tax;
  const freeDeliveryLeft = Math.max(0, 500 - subtotal);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-20 border-dashed">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-orange-400" />
            </div>
            <div>
              <p className="font-medium text-slate-700">Your cart is empty</p>
              <p className="text-sm text-slate-400 mt-1">Add items from restaurants to get started</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white mt-2">
              Browse Restaurants
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* ── Summary Cards ── */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-orange-50 border-orange-100">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-xs text-orange-600 font-medium mb-1">Items</p>
            <p className="text-2xl font-semibold text-orange-900">{cartItems.length}</p>
            <Badge variant="outline" className="mt-2 text-orange-600 border-orange-200 bg-white text-[11px]">
              In cart
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-slate-50 border-slate-100">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-xs text-slate-500 font-medium mb-1">Quantity</p>
            <p className="text-2xl font-semibold text-slate-800">{totalQty}</p>
            <Badge variant="outline" className="mt-2 text-slate-500 border-slate-200 text-[11px]">
              Units
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="pt-4 pb-4 px-4">
            <p className="text-xs text-green-700 font-medium mb-1">To pay</p>
            <p className="text-2xl font-semibold text-green-900">₹{total}</p>
            <Badge variant="outline" className="mt-2 text-green-700 border-green-200 bg-white text-[11px]">
              Confirmed
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* ── Free Delivery Banner ── */}
      {freeDeliveryLeft > 0 ? (
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <Truck className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              Add <span className="font-semibold">₹{freeDeliveryLeft}</span> more for free delivery
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-green-50 border-green-100">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <Truck className="w-4 h-4 text-green-600 shrink-0" />
            <p className="text-sm text-green-800 font-medium">You've unlocked free delivery!</p>
          </CardContent>
        </Card>
      )}

      {/* ── Cart Items ── */}
      <Card>
        <CardHeader className="pb-3 pt-4 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-orange-500" />
              Your cart
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
        </CardHeader>
        <Separator />
        <ScrollArea className="max-h-80">
          <CardContent className="p-0">
            {cartItems.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Image box */}
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shrink-0">
                    {item.image}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 text-sm truncate">{item.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.restaurant}</p>
                    <p className="text-sm text-orange-500 font-semibold mt-1">₹{item.price}</p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 rounded-full hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-sm font-semibold text-slate-700 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 rounded-full hover:bg-orange-100 hover:text-orange-600"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>

                  {/* Total + remove */}
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-slate-800 text-sm">₹{item.price * item.quantity}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-6 h-6 mt-1 hover:bg-red-50 hover:text-red-500 text-slate-300"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                {idx < cartItems.length - 1 && <Separator className="mx-5" />}
              </React.Fragment>
            ))}
          </CardContent>
        </ScrollArea>
      </Card>

      {/* ── Bill Details ── */}
      <Card>
        <CardHeader className="pb-3 pt-4 px-5">
          <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
            <Receipt className="w-4 h-4 text-slate-400" />
            Bill details
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-3 pb-4 px-5 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Item total</span>
            <span className="text-slate-700">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Delivery fee</span>
            {deliveryFee === 0
              ? <Badge variant="outline" className="text-green-600 border-green-200 text-xs py-0">Free</Badge>
              : <span className="text-slate-700">₹{deliveryFee}</span>
            }
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">GST &amp; charges</span>
            <span className="text-slate-700">₹{tax}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-semibold text-slate-800">To pay</span>
            <span className="font-semibold text-orange-500 text-lg">₹{total}</span>
          </div>
        </CardContent>
      </Card>

      {/* ── Checkout ── */}
      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base font-semibold rounded-xl flex items-center justify-between px-5">
        <span>Proceed to checkout</span>
        <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 text-sm">
          ₹{total}
        </Badge>
      </Button>

    </div>
  );
};

export default Cart;