import React from 'react';
import { Info, Sprout } from 'lucide-react';

const CategoryInfo = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-blue-800 mb-2">About Basic Categories</h3>
          <p className="text-sm text-blue-700 mb-3">
            The "Seed Categories" button will create essential categories with predefined attributes for sizes, colors, and fits. This is useful for setting up your e-commerce platform quickly.
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Sprout className="w-4 h-4" />
            <span>Creates categories like Men, Women, Sneakers with proper attributes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryInfo;