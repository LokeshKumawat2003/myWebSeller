import React from 'react';
import { FolderOpen, Plus, Sprout } from 'lucide-react';

const CategoryHeader = ({ onAddNew, onSeedCategories }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-indigo-100 mt-1">Organize products into categories and manage attributes</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onSeedCategories}
            className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-100 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
          >
            <Sprout className="w-4 h-4" />
            Seed Categories
          </button>
          <button
            onClick={onAddNew}
            className="px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryHeader;