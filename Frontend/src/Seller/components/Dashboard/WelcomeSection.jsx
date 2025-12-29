import React from 'react';
import { Hand } from 'lucide-react';

const WelcomeSection = ({ sellerName }) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-gray-900 p-6 md:p-8 rounded-xl shadow-lg mb-6 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
            Welcome back, {sellerName || 'Seller'}!
            <Hand className="ml-2 w-8 h-8" />
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Manage your store and products efficiently</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">Dashboard Overview</p>
            <p className="text-lg font-semibold text-gray-900">Ready to grow your business</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;