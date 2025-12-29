import React from 'react';
import { User, Shield, ShieldCheck, ShieldX } from 'lucide-react';

const RecentSellers = ({ sellers, onBlockSeller, onUnblockSeller, actionLoading }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="w-5 h-5 text-gray-700" />
        <h2 className="text-xl font-semibold text-gray-900">Recent Sellers</h2>
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {Array.isArray(sellers) && sellers.slice(0, 5).map((seller) => (
          <div key={seller._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <p className="font-medium text-gray-900">{seller.storeName || 'No Store'}</p>
              <p className="text-sm text-gray-600">{seller.user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {seller.blocked ? (
                  <ShieldX className="w-4 h-4 text-red-500" />
                ) : seller.approved ? (
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <Shield className="w-4 h-4 text-yellow-500" />
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  seller.blocked
                    ? 'bg-red-100 text-red-800'
                    : seller.approved
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {seller.blocked ? 'Blocked' : seller.approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              {seller.blocked ? (
                <button
                  onClick={() => onUnblockSeller(seller._id)}
                  disabled={actionLoading === seller._id}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  {actionLoading === seller._id ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShieldCheck className="w-3 h-3" />
                  )}
                  Unblock
                </button>
              ) : (
                <button
                  onClick={() => onBlockSeller(seller._id)}
                  disabled={actionLoading === seller._id}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                >
                  {actionLoading === seller._id ? (
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <ShieldX className="w-3 h-3" />
                  )}
                  Block
                </button>
              )}
            </div>
          </div>
        ))}
        {(!Array.isArray(sellers) || sellers.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No sellers found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSellers;