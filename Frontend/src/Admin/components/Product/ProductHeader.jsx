import React from 'react';
import { Package, TrendingUp, Star, Zap } from 'lucide-react';

const ProductHeader = ({ total, approved, pending, draft, rejected }) => {
  return (
    <div className="luxury-bg luxury-text-primary p-8 rounded-xl shadow-sm luxury-border">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="luxury-text-secondary mt-1">Manage and moderate product listings</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 luxury-text-secondary mb-1">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold luxury-accent">{total}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 luxury-text-secondary mb-1">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold luxury-accent">{approved}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 luxury-text-secondary mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold luxury-accent">{pending}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 luxury-text-secondary mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Draft</span>
            </div>
            <p className="text-2xl font-bold luxury-accent">{draft}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;