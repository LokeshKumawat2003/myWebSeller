import React from 'react';
import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const EarningsSummary = ({ earnings, loading }) => {
  const earningsCards = [
    {
      title: 'Total Sales',
      value: earnings?.totalSales || 0,
      icon: TrendingUp,
      color: 'text-[#9c7c3a]',
      bgColor: 'bg-white',
      borderColor: 'border-[#e6ddd2]'
    },
    {
      title: 'Pending Payment',
      value: earnings?.totalPending || 0,
      subtitle: `${earnings?.paymentCount || 0} products`,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-white',
      borderColor: 'border-[#e6ddd2]'
    },
    {
      title: 'Approved Payment',
      value: earnings?.totalApproved || 0,
      icon: CheckCircle,
      color: 'text-[#9c7c3a]',
      bgColor: 'bg-white',
      borderColor: 'border-[#e6ddd2]'
    },
    {
      title: 'Total Earned',
      value: earnings?.totalEarned || 0,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-white',
      borderColor: 'border-[#e6ddd2]'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#e6ddd2] p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-[#e6ddd2] rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-[#e6ddd2] rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e6ddd2] p-6 md:p-8">
      <h2 className="text-xl font-light italic text-[#3b3b3b] mb-8 font-serif">Earnings Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {earningsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`bg-white p-6 rounded-lg shadow-sm border ${card.borderColor} hover:shadow-md transition-all duration-300 group`}>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-full ${card.bgColor} border border-[#e6ddd2] group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
              <p className="text-sm font-light italic text-[#666] mb-2 font-serif">{card.title}</p>
              <p className={`text-2xl font-light italic ${card.color} font-serif`}>₹{card.value.toFixed(2)}</p>
              {card.subtitle && <p className="text-xs italic text-[#999] mt-2 font-serif">{card.subtitle}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EarningsSummary;