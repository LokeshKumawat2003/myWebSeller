import React from 'react';
import { ShoppingCart, CheckCircle, DollarSign, Package } from 'lucide-react';

const OrderHeader = ({ totalOrders, deliveredOrders, totalRevenue }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-indigo-100 mt-1">Monitor and manage all customer orders</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-2xl font-bold">{totalOrders}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Delivered</span>
            </div>
            <p className="text-2xl font-bold">{deliveredOrders}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;