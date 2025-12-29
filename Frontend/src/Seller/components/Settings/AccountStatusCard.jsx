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
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertTriangle,
        text: 'Blocked',
        description: 'Your account is currently blocked. Products are not visible to customers.'
      };
    } else if (sellerData?.approved) {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        text: 'Approved',
        description: 'Your account is active and products are visible to customers.'
      };
    } else {
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
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
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      label: 'Total Earned',
      value: earningsData?.totalEarned || 0,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      label: 'Pending Payout',
      value: earningsData?.totalPending || 0,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      label: 'Approved Not Paid',
      value: earningsData?.totalApproved || 0,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Shield className="w-6 h-6 text-indigo-600" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-gray-800">Account Status</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={loadingData}
          className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-2 text-sm"
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
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <span className="text-gray-600 font-medium">Current Status</span>
            <div className="flex items-center gap-2">
              <span className={`font-semibold px-3 py-1 rounded-full text-sm border flex items-center gap-1 ${statusConfig.color}`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig.text}
              </span>
            </div>
          </div>

          {/* Status Message */}
          <div className={`p-4 rounded-lg border text-sm ${
            sellerData?.blocked
              ? 'bg-red-50 border-red-200 text-red-800'
              : sellerData?.approved
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}>
            <div className="flex items-start gap-2">
              <StatusIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{statusConfig.description}</span>
            </div>
          </div>

          {/* Earnings Stats */}
          <div>
            <h3 className="text-md font-semibold text-gray-800 mb-4">Earnings Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className={`p-4 rounded-lg border ${stat.borderColor} bg-white hover:shadow-sm transition-shadow`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <StatIcon className={`w-4 h-4 ${stat.color}`} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className={`text-lg font-bold ${stat.color}`}>₹{stat.value.toFixed(2)}</p>
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