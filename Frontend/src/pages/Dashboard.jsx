import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  ShoppingCart, ShoppingBag, CreditCard, TrendingUp,
  CheckCircle, Clock, XCircle, ChevronRight,
  Package, Zap, Truck, Star,
} from 'lucide-react';
import { getMyOrders } from '../features/OrderSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SWIGGY_BASE_URL = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300,h_200,c_fit/";

// ── Reusable KPI card ─────────────────────────────────────────────────────────
const KPICard = ({ title, value, sub, icon: Icon, border, text, onClick }) => (
  <motion.div
    whileHover={{ y: -3 }}
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm p-5 border-l-4 ${border} hover:shadow-lg transition-all duration-200 cursor-pointer`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm mb-1">{title}</p>
        <p className={`text-3xl font-bold ${text}`}>{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-3 rounded-xl bg-gray-50`}>
        <Icon className={`w-6 h-6 ${text}`} />
      </div>
    </div>
  </motion.div>
);

// ── Section header ────────────────────────────────────────────────────────────
const SectionHeader = ({ title, label, onClick }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    <button
      onClick={onClick}
      className="text-orange-500 text-sm font-medium hover:underline flex items-center gap-1"
    >
      {label} <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    placed:    'bg-gray-100 text-gray-600',
    preparing: 'bg-yellow-100 text-yellow-700',
    pickedup:  'bg-orange-100 text-orange-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-600',
  };
  return (
    <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  const { items, count }      = useSelector((state) => state.cart);
  const { orders, loading }   = useSelector((state) => state.order);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) dispatch(getMyOrders());
  }, [dispatch, isAuthenticated]);

  // ── Derived stats ───────────────────────────────────────────────────────────
  const cartSubtotal = items.reduce(
    (sum, item) => sum + Math.floor((item.defaultPrice || item.price || 0) / 100) * item.quantity,
    0
  );
  const cartDelivery = cartSubtotal >= 500 ? 0 : (items.length > 0 ? 30 : 0);
  const cartTotal    = cartSubtotal + cartDelivery;

  const totalOrders     = orders.length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const activeOrders    = orders.filter(o => ['placed','preparing','pickedup'].includes(o.status)).length;
  const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;
  const totalSpent      = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const recentOrders  = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  const recentItems   = items.slice(0, 3);

  // ── Top KPIs ────────────────────────────────────────────────────────────────
  const kpis = [
    {
      title: 'Cart Items',
      value: count || 0,
      sub: count > 0 ? `₹${cartTotal} ready to checkout` : 'Cart is empty',
      icon: ShoppingCart,
      border: 'border-orange-500',
      text: 'text-orange-600',
      onClick: () => navigate('/cart'),
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      sub: `${deliveredOrders} delivered`,
      icon: ShoppingBag,
      border: 'border-blue-500',
      text: 'text-blue-600',
      onClick: () => navigate('/orders'),
    },
    {
      title: 'Active Orders',
      value: activeOrders,
      sub: activeOrders > 0 ? 'In progress right now' : 'No active orders',
      icon: Clock,
      border: 'border-yellow-500',
      text: 'text-yellow-600',
      onClick: () => navigate('/orders'),
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent}`,
      sub: `${deliveredOrders} successful orders`,
      icon: TrendingUp,
      border: 'border-green-500',
      text: 'text-green-600',
      onClick: () => navigate('/orders'),
    },
  ];

  return (
    <div className="w-full min-h-full bg-gray-50 p-6">

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isAuthenticated ? `Hey, ${user?.firstName || 'there'} 👋` : 'Welcome back 👋'}
        </h1>
        <p className="text-gray-500 mt-1">Here's a summary of your activity</p>
      </div>

      {/* Top KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {kpis.map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Order Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: 'Delivered', value: deliveredOrders, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending',   value: activeOrders,    icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Cancelled', value: cancelledOrders, icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.07 }}
            onClick={() => navigate('/orders')}
            className={`${bg} rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition`}
          >
            <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Two column: Cart preview + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        {/* Cart Preview */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100">
            <SectionHeader title="Your Cart" label="View Cart" onClick={() => navigate('/cart')} />
          </div>

          {items.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-8 h-8 text-orange-300" />
              </div>
              <p className="text-gray-500 text-sm mb-3">Your cart is empty</p>
              <Button
                onClick={() => navigate('/')}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              >
                Browse Restaurants
              </Button>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {recentItems.map((item) => (
                <div key={item.swiggyItemId} className="flex items-center gap-3">
                  <img
                    src={`${SWIGGY_BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-gray-700 shrink-0">
                    ₹{Math.floor((item.defaultPrice || item.price || 0) / 100) * item.quantity}
                  </p>
                </div>
              ))}

              {items.length > 3 && (
                <p className="text-xs text-gray-400 text-center">+{items.length - 3} more items</p>
              )}

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-bold text-orange-500 text-lg">₹{cartTotal}</p>
                </div>
                <Button
                  onClick={() => navigate('/checkout')}
                  className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                >
                  Checkout
                </Button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-5 border-b border-gray-100">
            <SectionHeader title="Recent Orders" label="All Orders" onClick={() => navigate('/orders')} />
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-gray-500 text-sm">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate('/orders')}
                  className="p-4 hover:bg-gray-50 transition cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm text-gray-800">
                      Order #{order._id.slice(-6)}
                    </p>
                    <StatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-gray-400 mb-1">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                      {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                    <p className="font-bold text-sm text-orange-500">₹{order.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Payment summary strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-6 text-white"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">Ready to checkout?</p>
              <p className="text-orange-100 text-sm">
                {items.length > 0
                  ? `${count} item${count !== 1 ? 's' : ''} worth ₹${cartTotal} in your cart`
                  : 'Add items to your cart to get started'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/cart')}
              className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-xl"
              variant="outline"
            >
              <ShoppingCart className="w-4 h-4 mr-2" /> Cart
            </Button>
            <Button
              onClick={() => navigate('/checkout')}
              disabled={items.length === 0}
              className="bg-white text-orange-500 hover:bg-orange-50 rounded-xl font-bold"
            >
              Pay Now <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
        {[
          { icon: Zap,     title: 'Fast Delivery',   desc: 'Average 25-30 min delivery time',  color: 'text-yellow-500', bg: 'bg-yellow-50' },
          { icon: Star,    title: 'Top Rated',        desc: 'Restaurants curated for quality',  color: 'text-orange-500', bg: 'bg-orange-50' },
          { icon: Package, title: 'Order Tracking',  desc: 'Live updates on every order',      color: 'text-blue-500',   bg: 'bg-blue-50'   },
        ].map(({ icon: Icon, title, desc, color, bg }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.07 }}
            className={`${bg} rounded-2xl p-5 flex items-start gap-4`}
          >
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}