import React from 'react';
import { Loader2, ShoppingCart } from 'lucide-react';

const OrderLoadingState = () => {
  return (
    <div className="luxury-bg rounded-xl shadow-sm luxury-border p-12">
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin luxury-accent mr-3" />
        <div>
          <p className="luxury-text-secondary font-medium italic">Loading orders...</p>
          <p className="text-sm luxury-text-secondary mt-1 italic">Please wait while we fetch the order data</p>
        </div>
      </div>
    </div>
  );
};

const OrderEmptyState = () => {
  return (
    <div className="luxury-bg rounded-xl shadow-sm luxury-border p-12">
      <div className="text-center">
        <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium luxury-text-primary mb-2 italic">No orders found</h3>
        <p className="luxury-text-secondary italic">Orders will appear here once customers place them</p>
      </div>
    </div>
  );
};

export { OrderLoadingState, OrderEmptyState };