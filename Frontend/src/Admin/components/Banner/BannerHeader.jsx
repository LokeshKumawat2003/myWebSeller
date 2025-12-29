import React from 'react';
import { Plus, X } from 'lucide-react';

const BannerHeader = ({ onAddNew }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-indigo-100 mt-1">Manage promotional banners and their display order</p>
        </div>
        <button
          onClick={onAddNew}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
        >
          <Plus className="w-5 h-5" />
          Add New Banner
        </button>
      </div>
    </div>
  );
};

export default BannerHeader;