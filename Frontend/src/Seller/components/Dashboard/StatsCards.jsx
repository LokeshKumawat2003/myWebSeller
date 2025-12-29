import React from 'react';
import { Package, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const StatsCards = ({ stats }) => {
  const getIcon = (label, value) => {
    switch (label) {
      case 'Total Products':
        return <Package className="w-8 h-8" />;
      case 'Total Earnings':
        return <DollarSign className="w-8 h-8" />;
      case 'Pending Payout':
        return <Clock className="w-8 h-8" />;
      case 'Status':
        if (value === 'Approved') return <CheckCircle className="w-8 h-8" />;
        if (value === 'Blocked') return <XCircle className="w-8 h-8" />;
        return <AlertCircle className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 p-4 md:p-6 border border-[#e6ddd2]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#666] text-sm italic mb-1 font-serif">{stat.label}</p>
              <div className={`${stat.color} text-white font-light italic text-lg md:text-xl px-3 py-1 rounded-full inline-block font-serif`}>
                {stat.value}
              </div>
            </div>
            <div className="text-[#9c7c3a]">
              {getIcon(stat.label, stat.value)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;