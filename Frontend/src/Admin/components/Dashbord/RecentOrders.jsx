import React from 'react';
import { ShoppingCart, CheckCircle, Clock } from 'lucide-react';

const RecentOrders = ({ orders }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {Array.isArray(orders) && orders.slice(0, 5).map((order) => (
          <div key={order._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <p className="font-medium text-gray-900">Order #{order._id?.substring(0, 8)}</p>
              <p className="text-sm text-gray-600">${(order.total || 0).toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-2">
              {order.status === 'completed' ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Clock className="w-4 h-4 text-blue-500" />
              )}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {order.status || 'pending'}
              </span>
            </div>
          </div>
        ))}
        {(!Array.isArray(orders) || orders.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentOrders;