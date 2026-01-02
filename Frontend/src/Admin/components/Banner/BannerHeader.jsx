import React from 'react';
import { Plus, X } from 'lucide-react';

const BannerHeader = ({ onAddNew }) => {
  return (
    <div className="bg-gradient-to-r from-[#fbf7f2] to-[#f5f0e8] text-[#3b3b3b] p-8 rounded-xl shadow-sm border border-[#e6ddd2]">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Banner Management</h1>
          <p className="text-[#666] mt-1">Manage promotional banners and their display order</p>
        </div>
        <button
          onClick={onAddNew}
          className="px-6 py-3 bg-[#9c7c3a] hover:bg-[#8a6a2f] text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add New Banner
        </button>
      </div>
    </div>
  );
};

export default BannerHeader;