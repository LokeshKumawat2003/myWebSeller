import React from 'react';
import { Loader2, Users } from 'lucide-react';

const SellerLoadingState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <div>
          <p className="text-gray-600 font-medium">Loading sellers...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the data</p>
        </div>
      </div>
    </div>
  );
};

const SellerEmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No sellers found</h3>
        <p className="text-gray-600">Seller registrations will appear here once users sign up</p>
      </div>
    </div>
  );
};

export { SellerLoadingState, SellerEmptyState };