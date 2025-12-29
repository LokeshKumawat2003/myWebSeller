import React from 'react';

const RecentSellers = ({ sellers, actionLoading, handleBlockSeller, handleUnblockSeller }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-purple-600">🏪</span>
        Recent Sellers
      </h2>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {Array.isArray(sellers) && sellers.slice(0, 5).map((seller) => (
          <div key={seller._id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{seller.storeName || 'No Store'}</p>
              <p className="text-sm text-gray-600">{seller.user?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                seller.blocked ? 'bg-red-100 text-red-800' : (seller.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800')
              }`}>
                {seller.blocked ? 'Blocked' : (seller.approved ? 'Approved' : 'Pending')}
              </span>
              {seller.blocked ? (
                <button
                  onClick={() => handleUnblockSeller(seller._id)}
                  disabled={actionLoading === seller._id}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {actionLoading === seller._id ? '...' : 'Unblock'}
                </button>
              ) : (
                <button
                  onClick={() => handleBlockSeller(seller._id)}
                  disabled={actionLoading === seller._id}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {actionLoading === seller._id ? '...' : 'Block'}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSellers;