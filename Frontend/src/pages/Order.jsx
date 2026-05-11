import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getMyOrders, cancelOrder } from '../features/OrderSlice';
import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle, Clock, XCircle } from 'lucide-react';

const SWIGGY_BASE_URL = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,h_600/";

// ─── Progress Steps Config ───────────────────────────────────────────────────
const STEPS = ['placed', 'preparing', 'pickedup', 'delivered']; // Fixed spelling
const STEP_LABELS = {
  placed: 'Placed',
  preparing: 'Preparing',
  pickedup: 'Picked up',
  delivered: 'Delivered',
};

const OrderProgressBar = ({ status }) => {
  // Handle cancelled orders - don't show progress bar
  if (status === 'cancelled') return null;
  
  const currentIndex = STEPS.indexOf(status);
  
  // If status not found in steps (e.g., 'cancelled'), don't render
  if (currentIndex === -1) return null;

  return (
    <div className="flex items-center w-full my-4 px-1">
      {STEPS.map((step, idx) => {
        const isCompleted = currentIndex > idx;
        const isActive = currentIndex === idx;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1 min-w-[60px]">
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300
                  ${isCompleted
                    ? 'bg-green-500 border-green-500'
                    : isActive
                      ? 'bg-white border-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.25)]'
                      : 'bg-white border-gray-300'
                  }`}
              >
                {isCompleted && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </div>
              <span
                className={`text-[11px] font-medium text-center leading-tight
                  ${isCompleted || isActive ? 'text-green-600' : 'text-gray-400'}`}
              >
                {STEP_LABELS[step]}
              </span>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 mb-4 rounded-full overflow-hidden bg-gray-200">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: currentIndex > idx ? '100%' : currentIndex === idx ? '50%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ─── KPI Card Component ──────────────────────────────────────────────────────
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

// ─── Main Component ───────────────────────────────────────────────────────────
const Order = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector(state => state.order);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    dispatch(getMyOrders());
  }, [dispatch]);

  // Calculate KPI stats from orders
  const calculateStats = () => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const pending = orders.filter(o => o.status === 'placed' || o.status === 'preparing' || o.status === 'pickedup').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    return { total, delivered, pending, cancelled };
  };

  const stats = calculateStats();

  const kpiConfigs = [
    { title: "Total Orders", value: stats.total, icon: ShoppingBag, bgColor: "border-blue-500", textColor: "text-blue-600", cardBg: "bg-blue-50" },
    { title: "Delivered", value: stats.delivered, icon: CheckCircle, bgColor: "border-green-500", textColor: "text-green-600", cardBg: "bg-green-50" },
    { title: "Pending", value: stats.pending, icon: Clock, bgColor: "border-orange-500", textColor: "text-orange-600", cardBg: "bg-orange-50" },
    { title: "Cancelled", value: stats.cancelled, icon: XCircle, bgColor: "border-red-500", textColor: "text-red-600", cardBg: "bg-red-50" }
  ];

  const filteredOrders = orders.filter(order =>
    filter === 'all' ? true : order.status === filter
  );

  const handleCancel = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder({ orderId, reason: 'Changed my mind' }));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'placed': return 'bg-gray-100 text-gray-600';
      case 'preparing': return 'bg-yellow-100 text-yellow-600';
      case 'pickedup': return 'bg-orange-100 text-orange-600';
      case 'delivered': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    const cleanPath = imagePath.replace(/^\/+/, '');
    return `${SWIGGY_BASE_URL}${cleanPath}`;
  };

  return (
    <div className="w-full min-h-full bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpiConfigs.map((kpi, idx) => (
          <KPICard key={idx} {...kpi} />
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {['all', 'placed', 'preparing', 'pickedup', 'delivered', 'cancelled'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition capitalize ${
              filter === f
                ? 'bg-orange-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {f === 'all' ? 'All Orders' : f}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {filteredOrders.map((order) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div className="p-5">
                  {/* Header */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="space-y-1">
                      <h2 className="font-bold text-gray-800 text-lg">
                        Order #{order._id.slice(-8)}
                      </h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="rounded-lg px-4 py-2 text-sm font-medium border-amber-300 text-amber-700 hover:bg-amber-50 transition"
                      >
                        Order Details
                      </Button>

                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <Button
                          onClick={() => handleCancel(order._id)}
                          className="rounded-lg px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition shadow-sm"
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar - only for active orders */}
                  {order.status !== 'cancelled' && (
                    <OrderProgressBar status={order.status} />
                  )}

                  {/* Reorder button for delivered orders */}
                  {order.status === 'delivered' && (
                    <button className="mb-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
                      Reorder
                    </button>
                  )}
                </div>

                {/* Items List */}
                <div className="px-5 pb-5">
                  <div className="mb-4 divide-y divide-gray-100">
                    {order.items.map((item, idx) => {
                      const imageUrl = getImageUrl(item.image);
                      return (
                        <div key={idx} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-xl bg-gray-50 shadow-sm"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex justify-between items-baseline flex-wrap gap-2">
                              <span className="font-semibold text-gray-800">{item.name}</span>
                              <div className="text-right">
                                <span className="font-semibold text-gray-900">₹{item.price}</span>
                                <span className="text-gray-500 text-sm ml-1">each</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 mt-0.5">Quantity: {item.quantity}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Price summary & address */}
                  <div className="border-t border-gray-100 pt-3">
                    <div className="flex justify-between items-center text-sm flex-wrap gap-2">
                      <div className="text-gray-500 flex items-center gap-1">
                        <span>📍</span> {order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                      </div>
                      <div className="font-bold text-gray-800 text-lg">
                        Total: ₹{order.totalAmount}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {!loading && filteredOrders.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No orders found</p>
                <button 
                  onClick={() => window.location.href = '/'}
                  className="mt-3 text-orange-500 text-sm hover:underline"
                >
                  Start ordering →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Order;