import React from 'react';
import { Loader2, FolderOpen } from 'lucide-react';

const CategoryLoadingState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
        <div>
          <p className="text-gray-600 font-medium">Loading categories...</p>
          <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the category data</p>
        </div>
      </div>
    </div>
  );
};

const CategoryEmptyState = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
      <div className="text-center">
        <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
        <p className="text-gray-600">Get started by adding your first category or seeding basic categories</p>
      </div>
    </div>
  );
};

export { CategoryLoadingState, CategoryEmptyState };