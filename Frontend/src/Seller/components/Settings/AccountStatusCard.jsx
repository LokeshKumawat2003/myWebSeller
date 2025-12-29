import React from 'react';
import {
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  Shield
} from 'lucide-react';

const AccountStatusCard = ({
  sellerData,
  earningsData,
  loadingData,
  onRefresh
}) => {
  const getStatusConfig = (sellerData) => {
    if (sellerData?.blocked) {
      return {
        color: 'bg-[#e6ddd2] text-[#3b3b3b] border-[#9c7c3a]',
        icon: AlertTriangle,
        text: 'Blocked',
        description: 'Your account is currently blocked. Products are not visible to customers.'
      };
    } else if (sellerData?.approved) {
      return {
        color: 'bg-[#9c7c3a] text-white',
        icon: CheckCircle,
        text: 'Approved',
        description: 'Your account is active and products are visible to customers.'
      };
    } else {
      return {
        color: 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]',
        icon: Clock,
        text: 'Pending',
        description: 'Your account is under review. Products will be visible once approved.'
      };
    }
  };

  const statusConfig = getStatusConfig(sellerData);
  const StatusIcon = statusConfig.icon;

  const stats = [
    {
      label: 'Total Sales',
      value: earningsData?.totalSales || 0,
      icon: TrendingUp,
      color: 'text-[#9c7c3a]',
      bgColor: 'bg-[#fbf7f2]',
      borderColor: 'border-[#e6ddd2]'
    },
    {
      label: 'Total Earned',
      value: earningsData?.totalEarned || 0,
      icon: DollarSign,
      color: 'text-[#9c7c3a]',
      bgColor: 'bg-[#fbf7f2]',
      borderColor: 'border-[#e6ddd2]'
    },
    {
      label: 'Pending Payout',
      value: earningsData?.totalPending || 0,
      icon: Clock,
      color: 'text-[#666]',
      bgColor: 'bg-[#e6ddd2]',
      borderColor: 'border-[#9c7c3a]'
    },
    {
      label: 'Approved Not Paid',
      value: earningsData?.totalApproved || 0,
      icon: CheckCircle,
      color: 'text-[#9c7c3a]',
      bgColor: 'bg-[#fbf7f2]',
      borderColor: 'border-[#e6ddd2]'
    }
  ];

  return (
    <div className="bg-[#fbf7f2] rounded-xl shadow-md border border-[#e6ddd2] p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#e6ddd2] rounded-lg">
            <Shield className="w-6 h-6 text-[#9c7c3a]" />
          </div>
          <h2 className="text-lg md:text-xl font-light italic text-[#3b3b3b] font-serif">Account Status</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={loadingData}
          className="px-3 py-2 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2 text-sm font-sans"
        >
          {loadingData ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Refresh
            </>
          )}
        </button>
      </div>

      {loadingData ? (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-[#e6ddd2] rounded w-1/3 mx-auto mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-[#e6ddd2] rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <span className="text-[#666] font-medium font-sans">Current Status</span>
            <div className="flex items-center gap-2">
              <span className={`font-semibold px-3 py-1 rounded-full text-sm border flex items-center gap-1 ${statusConfig.color} font-sans`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.text}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className={`p-4 rounded-lg border text-sm ${
            sellerData?.blocked
              ? 'bg-[#e6ddd2] border-[#9c7c3a] text-[#3b3b3b]'
              : sellerData?.approved
              ? 'bg-[#fbf7f2] border-[#e6ddd2] text-[#666]'
              : 'bg-[#fbf7f2] border-[#e6ddd2] text-[#666]'
          }`}>
            <div className="flex items-start gap-2">
              <StatusIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{statusConfig.description}</span>
            </div>
          </div>

          {/* Earnings Stats */}
          <div>
            <h3 className="text-md font-light italic text-[#3b3b3b] mb-4 font-serif">Earnings Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className={`p-4 rounded-lg border ${stat.borderColor} bg-[#fbf7f2] hover:shadow-sm transition-shadow`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <StatIcon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-sm text-[#666] mb-1 font-sans">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color} font-sans`}>₹{stat.value.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountStatusCard;