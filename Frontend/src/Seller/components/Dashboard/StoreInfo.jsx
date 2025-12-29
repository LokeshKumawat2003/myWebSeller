import React from 'react';
import { Store } from 'lucide-react';

const StoreInfo = ({ sellerData, earningsData }) => {
  const infoItems = [
    { label: 'Store Name', value: sellerData?.storeName || 'Not set' },
    { label: 'Email', value: typeof sellerData?.user === 'object' && sellerData?.user?.email ? sellerData.user.email : '-' },
    { label: 'Account Status', value: sellerData?.blocked ? '❌ Blocked' : sellerData?.approved ? '✓ Approved' : '⏳ Pending', color: sellerData?.blocked ? 'text-[#666] bg-[#e6ddd2]' : sellerData?.approved ? 'text-white bg-[#9c7c3a]' : 'text-[#666] bg-[#fbf7f2] border border-[#e6ddd2]' },
    { label: 'Total Sales', value: `₹${(earningsData?.totalSales || 0).toFixed(2)}` },
    { label: 'Total Earned', value: `₹${(earningsData?.totalEarned || 0).toFixed(2)}`, color: 'text-[#9c7c3a]' },
    { label: 'Pending Payout', value: `₹${(earningsData?.totalPending || 0).toFixed(2)}`, color: 'text-[#666]' },
    { label: 'Approved Not Paid', value: `₹${(earningsData?.totalApproved || 0).toFixed(2)}`, color: 'text-[#9c7c3a]' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 border border-[#e6ddd2]">
      <h2 className="text-xl md:text-2xl font-light italic text-[#3b3b3b] mb-4 flex items-center font-serif">
        <Store className="mr-2 w-6 h-6 text-[#9c7c3a]" />
        Store Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {infoItems.map((item, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-[#fbf7f2] rounded-lg border border-[#e6ddd2]">
            <span className="text-[#666] italic text-sm md:text-base mb-1 sm:mb-0 font-serif">{item.label}:</span>
            <span className={`font-light italic text-sm md:text-base ${item.color || 'text-[#3b3b3b]'} font-serif`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreInfo;