import React from 'react';
import { Store } from 'lucide-react';

const StoreInfo = ({ sellerData, earningsData }) => {
  const infoItems = [
    { label: 'Store Name', value: sellerData?.storeName || 'Not set' },
    { label: 'Email', value: typeof sellerData?.user === 'object' && sellerData?.user?.email ? sellerData.user.email : '-' },
    { label: 'Account Status', value: sellerData?.blocked ? '❌ Blocked' : sellerData?.approved ? '✓ Approved' : '⏳ Pending', color: sellerData?.blocked ? 'text-red-600 bg-red-50' : sellerData?.approved ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50' },
    { label: 'Total Sales', value: `₹${(earningsData?.totalSales || 0).toFixed(2)}` },
    { label: 'Total Earned', value: `₹${(earningsData?.totalEarned || 0).toFixed(2)}`, color: 'text-green-600' },
    { label: 'Pending Payout', value: `₹${(earningsData?.totalPending || 0).toFixed(2)}`, color: 'text-yellow-600' },
    { label: 'Approved Not Paid', value: `₹${(earningsData?.totalApproved || 0).toFixed(2)}`, color: 'text-blue-600' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-gray-100">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center">
        <Store className="mr-2 w-6 h-6" />
        Store Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium text-sm md:text-base mb-1 sm:mb-0">{item.label}:</span>
            <span className={`font-semibold text-sm md:text-base ${item.color || 'text-gray-800'}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreInfo;