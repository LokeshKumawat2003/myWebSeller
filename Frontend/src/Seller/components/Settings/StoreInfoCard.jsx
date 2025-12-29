import React from 'react';
import { Store, Mail, Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const StoreInfoCard = ({ sellerData }) => {
  const getStatusConfig = (sellerData) => {
    if (sellerData?.blocked) {
      return {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertTriangle,
        text: 'Blocked'
      };
    } else if (sellerData?.approved) {
      return {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        text: 'Approved'
      };
    } else {
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: Clock,
        text: 'Pending'
      };
    }
  };

  const statusConfig = getStatusConfig(sellerData);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Store className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-gray-800">Store Information</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium mb-1 sm:mb-0">Store Name</span>
          <span className="text-gray-900 font-semibold">{sellerData?.storeName || '-'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-gray-100">
          <span className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </span>
          <span className="text-gray-900 font-semibold">{sellerData?.user?.email || '-'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
          <span className="text-gray-600 font-medium mb-1 sm:mb-0 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Account Status
          </span>
          <span className={`font-semibold px-3 py-1 rounded-full text-sm border flex items-center gap-1 w-fit ${statusConfig.color}`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoCard;