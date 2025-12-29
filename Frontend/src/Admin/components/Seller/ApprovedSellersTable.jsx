import React from 'react';
import { CheckCircle, Shield, ShieldCheck, Loader2, DollarSign } from 'lucide-react';

const ApprovedSellersTable = ({ sellers, onBlock, onUnblock, approving }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-green-50 px-6 py-4 border-b border-green-200">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <h2 className="text-lg font-semibold text-green-800">Approved Sellers ({sellers.length})</h2>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Store Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Owner Email</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Earnings</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pending Payout</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sellers.map((seller) => (
              <tr key={seller._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{seller.storeName || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {seller.user?.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="font-medium">${(seller.earnings || 0).toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-amber-600" />
                    <span className="font-medium">${(seller.pendingPayout || 0).toFixed(2)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {seller.blocked ? (
                      <button
                        onClick={() => onUnblock(seller._id)}
                        disabled={approving === seller._id}
                        className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {approving === seller._id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 mr-1" />
                        )}
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => onBlock(seller._id)}
                        disabled={approving === seller._id}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {approving === seller._id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : (
                          <Shield className="w-4 h-4 mr-1" />
                        )}
                        Block
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApprovedSellersTable;