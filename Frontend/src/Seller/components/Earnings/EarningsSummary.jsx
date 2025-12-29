import React from 'react';
import { DollarSign, Clock, CheckCircle, TrendingUp } from 'lucide-react';

const EarningsSummary = ({ earnings, loading }) => {
  const earningsCards = [
    {
      title: 'Total Sales',
      value: earnings?.totalSales || 0,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Pending Payment',
      value: earnings?.totalPending || 0,
      subtitle: `${earnings?.paymentCount || 0} products`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      title: 'Approved Payment',
      value: earnings?.totalApproved || 0,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Total Earned',
      value: earnings?.totalEarned || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Earnings Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {earningsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className={`bg-white p-4 md:p-6 rounded-xl shadow-sm border ${card.borderColor} hover:shadow-md transition-all duration-300`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 md:p-3 rounded-lg ${card.bgColor}`}>
                  <IconComponent className={`w-5 h-5 md:w-6 md:h-6 ${card.color}`} />
                </div>
              </div>
              <p className="text-gray-600 text-xs md:text-sm mb-2">{card.title}</p>
              <p className={`text-xl md:text-2xl lg:text-3xl font-bold ${card.color}`}>₹{card.value.toFixed(2)}</p>
              {card.subtitle && <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EarningsSummary;