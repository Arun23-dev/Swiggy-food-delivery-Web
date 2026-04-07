import React, { useState } from 'react';

const Order = () => {
  const [activeFilter, setActiveFilter] = useState('active');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = {
    active: [
      {
        id: '#ORD001',
        restaurant: 'Biryani House',
        items: ['Chicken Biryani', 'Raita'],
        quantity: [2, 1],
        total: 450,
        status: 'on_the_way',
        statusText: 'On the way',
        time: '10-15 min',
        deliveryPartner: 'Rahul',
        deliveryPartnerPhone: '+91 98765 43210',
        eta: '10 minutes',
      },
      {
        id: '#ORD002',
        restaurant: 'Pizza Hut',
        items: ['Margherita Pizza', 'Garlic Bread'],
        quantity: [1, 2],
        total: 899,
        status: 'preparing',
        statusText: 'Preparing',
        time: '25-30 min',
        estimatedPickup: '7:45 PM',
      },
    ],
    past: [
      {
        id: '#ORD003',
        restaurant: 'McDonalds',
        items: ['McChicken Burger', 'Fries', 'Coke'],
        quantity: [2, 1, 1],
        total: 350,
        status: 'delivered',
        statusText: 'Delivered',
        time: 'Yesterday',
        deliveredOn: 'Yesterday at 7:30 PM',
        rating: null,
      },
      {
        id: '#ORD004',
        restaurant: 'KFC',
        items: ['Hot & Crispy Chicken', 'Popcorn'],
        quantity: [1, 2],
        total: 520,
        status: 'delivered',
        statusText: 'Delivered',
        time: 'Jan 15, 2024',
        deliveredOn: 'Jan 15, 2024 at 8:15 PM',
        rating: 5,
      },
    ],
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on_the_way': return 'text-orange-600';
      case 'preparing': return 'text-blue-600';
      case 'delivered': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'on_the_way': return 'bg-orange-50 border-orange-200';
      case 'preparing': return 'bg-blue-50 border-blue-200';
      case 'delivered': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on_the_way': return '🚗';
      case 'preparing': return '👨‍🍳';
      case 'delivered': return '✅';
      default: return '📦';
    }
  };

  const currentOrders = orders[activeFilter];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Orders</h2>
        <p className="text-sm text-gray-500">Track and manage your orders</p>
      </div>
      
      {/* Filter Tabs */}
      <div className="flex gap-3 mb-6 border-b border-gray-200">
        <button
          className={`pb-3 px-4 text-sm font-medium transition-all duration-200 ${
            activeFilter === 'active' 
              ? 'text-orange-500 border-b-2 border-orange-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveFilter('active')}
        >
          Active Orders ({orders.active.length})
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium transition-all duration-200 ${
            activeFilter === 'past' 
              ? 'text-orange-500 border-b-2 border-orange-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveFilter('past')}
        >
          Order History ({orders.past.length})
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {currentOrders.length === 0 ? (
          // Empty State
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">🍽️</div>
            <p className="text-gray-500 text-lg font-medium">No {activeFilter} orders</p>
            <p className="text-sm text-gray-400 mt-2">
              {activeFilter === 'active' 
                ? 'When you place an order, it will appear here' 
                : 'Your past orders will be shown here'}
            </p>
            {activeFilter === 'active' && (
              <button className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition">
                Browse Restaurants
              </button>
            )}
          </div>
        ) : (
          currentOrders.map((order) => (
            <div 
              key={order.id} 
              className={`bg-white rounded-xl border ${getStatusBg(order.status)} p-4 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              {/* Order Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{getStatusIcon(order.status)}</span>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {order.restaurant}
                    </h3>
                  </div>
                  <span className={`text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.statusText}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-800 text-xl">
                    ₹{order.total}
                  </div>
                  <span className="text-xs text-gray-400">{order.id}</span>
                </div>
              </div>
              
              {/* Order Items */}
              <div className="mb-3 pl-9">
                <div className="space-y-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600">
                      <span className="font-medium">{order.quantity?.[idx] || 1}x</span> {item}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Order Meta & Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-400">
                  {order.status === 'on_the_way' && (
                    <div className="space-y-1">
                      <div>🚗 Delivery by {order.deliveryPartner}</div>
                      <div>⏱️ ETA: {order.eta}</div>
                    </div>
                  )}
                  {order.status === 'preparing' && (
                    <div>⏱️ Ready by {order.estimatedPickup}</div>
                  )}
                  {order.status === 'delivered' && (
                    <div>✅ Delivered on {order.deliveredOn}</div>
                  )}
                  <div className="mt-1">⏱️ {order.time}</div>
                </div>
                
                <div className="flex gap-2">
                  {order.status === 'delivered' && (
                    <>
                      {!order.rating && (
                        <button className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-yellow-600 transition">
                          Rate Order ⭐
                        </button>
                      )}
                      <button className="bg-orange-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-orange-600 transition">
                        Reorder
                      </button>
                    </>
                  )}
                  {order.status === 'on_the_way' && (
                    <>
                      <button className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition">
                        Track Order
                      </button>
                      <button className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-green-600 transition">
                        Contact Delivery Partner
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button className="bg-gray-100 text-gray-500 px-4 py-1.5 rounded-lg text-sm font-medium cursor-not-allowed">
                      Preparing your order
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Order;