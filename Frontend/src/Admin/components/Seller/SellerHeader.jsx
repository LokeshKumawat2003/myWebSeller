import React from 'react';
import { Users, Clock, CheckCircle, DollarSign } from 'lucide-react';
import { Card } from '../UI';

const SellerHeader = ({ total, approved, pending }) => {
  return (
    <Card className="luxury-text-primary" padding="p-6 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold luxury-accent">Seller Management</h1>
          <p className="luxury-text-secondary mt-1 font-sans">Manage seller accounts and approvals</p>
        </div>
        <div className="flex flex-wrap justify-center lg:justify-end gap-4 lg:gap-6">
          <div className="text-center min-w-[80px]">
            <div className="flex items-center justify-center gap-2 luxury-text-secondary mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium font-sans">Total</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold luxury-accent font-serif">{total}</p>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="flex items-center justify-center gap-2 luxury-text-secondary mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium font-sans">Approved</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold luxury-accent font-serif">{approved}</p>
          </div>
          <div className="text-center min-w-[80px]">
            <div className="flex items-center justify-center gap-2 luxury-text-secondary mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium font-sans">Pending</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold luxury-accent font-serif">{pending}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SellerHeader;