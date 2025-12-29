import React from 'react';
import { Store, Mail, Shield, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const StoreInfoCard = ({ sellerData }) => {
  const getStatusConfig = (sellerData) => {
    if (sellerData?.blocked) {
      return {
        color: 'bg-[#e6ddd2] text-[#3b3b3b] border-[#9c7c3a]',
        icon: AlertTriangle,
        text: 'Blocked'
      };
    } else if (sellerData?.approved) {
      return {
        color: 'bg-[#9c7c3a] text-white',
        icon: CheckCircle,
        text: 'Approved'
      };
    } else {
      return {
        color: 'bg-[#fbf7f2] text-[#666] border border-[#e6ddd2]',
        icon: Clock,
        text: 'Pending'
      };
    }
  };

  const statusConfig = getStatusConfig(sellerData);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-[#fbf7f2] rounded-xl shadow-md border border-[#e6ddd2] p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#e6ddd2] rounded-lg">
          <Store className="w-6 h-6 text-[#9c7c3a]" />
        </div>
        <h2 className="text-lg md:text-xl font-light italic text-[#3b3b3b] font-serif">Store Information</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-[#e6ddd2]">
          <span className="text-[#666] font-medium mb-1 sm:mb-0 font-sans">Store Name</span>
          <span className="text-[#3b3b3b] font-semibold font-sans">{sellerData?.storeName || '-'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b border-[#e6ddd2]">
          <span className="text-[#666] font-medium mb-1 sm:mb-0 flex items-center gap-2 font-sans">
            <Mail className="w-4 h-4" />
            Email
          </span>
          <span className="text-[#3b3b3b] font-semibold font-sans">{sellerData?.user?.email || '-'}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
          <span className="text-[#666] font-medium mb-1 sm:mb-0 flex items-center gap-2 font-sans">
            <Shield className="w-4 h-4" />
            Account Status
          </span>
          <span className={`font-semibold px-3 py-1 rounded-full text-sm border flex items-center gap-1 w-fit ${statusConfig.color} font-sans`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoreInfoCard;