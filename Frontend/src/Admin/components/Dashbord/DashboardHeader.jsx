import React from 'react';
import { RefreshCw } from 'lucide-react';

const DashboardHeader = ({ onRefresh, loading }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-indigo-100">Manage sellers, products, orders and users efficiently</p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:bg-white/10 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;