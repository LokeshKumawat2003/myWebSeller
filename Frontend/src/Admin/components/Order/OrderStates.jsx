import React from 'react';
import { Loader2, ShoppingCart } from 'lucide-react';

const OrderLoadingState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <div>
          <p className="text-gray-600 font-medium">Loading orders...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the order data</p>
        </div>
      </div>
    </div>
  );
};

const OrderEmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="text-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-600">Orders will appear here once customers place them</p>
      </div>
    </div>
  );
};

export { OrderLoadingState, OrderEmptyState };