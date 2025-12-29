import React from 'react';
import { Users, Clock, CheckCircle, DollarSign } from 'lucide-react';

const SellerHeader = ({ total, approved, pending }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Seller Management</h1>
          <p className="text-indigo-100 mt-1">Manage seller accounts and approvals</p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold">{total}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Approved</span>
            </div>
            <p className="text-2xl font-bold">{approved}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2 text-indigo-100 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="text-2xl font-bold">{pending}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerHeader;