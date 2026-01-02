import React from 'react';
import { ShoppingCart, CheckCircle, DollarSign, Package } from 'lucide-react';

const OrderHeader = ({ totalOrders, deliveredOrders, totalRevenue }) => {
  return (
    <div className="bg-gradient-to-r from-[#fbf7f2] to-[#f5f0e8] text-[#3b3b3b] p-8 rounded-xl shadow-sm border border-[#e6ddd2]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-[#666] mt-1">Monitor and manage all customer orders</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 text-[#666] mb-1">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">Total Orders</span>
            </div>
            <p className="text-2xl font-bold text-[#9c7c3a]">{totalOrders}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-[#666] mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Delivered</span>
            </div>
            <p className="text-2xl font-bold text-[#9c7c3a]">{deliveredOrders}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-[#666] mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-[#9c7c3a]">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;