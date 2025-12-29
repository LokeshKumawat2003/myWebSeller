import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar, Eye, EyeOff } from 'lucide-react';

const PaymentHistoryCards = ({ paymentHistory, onOpenModal }) => {
  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'bg-[#e6ddd2] text-[#3b3b3b] border-[#9c7c3a]', icon: Clock },
      approved: { color: 'bg-[#f5f0e8] text-[#9c7c3a] border-[#e6ddd2]', icon: CheckCircle },
      paid: { color: 'bg-[#9c7c3a] text-white', icon: CheckCircle },
      rejected: { color: 'bg-[#e6ddd2] text-[#666] border-[#9c7c3a]', icon: AlertCircle },
    };
    const config = configs[status] || { color: 'bg-[#e6ddd2] text-[#666] border-[#e6ddd2]', icon: AlertCircle };
    const IconComponent = config.icon;

    return `px-2 py-1 rounded-full text-xs font-semibold border ${config.color} flex items-center gap-1 w-fit font-sans`;
  };

  return (
    <div className="md:hidden">
      {paymentHistory.map(payment => (
        <div key={payment._id} className="border-b border-[#e6ddd2] p-4 hover:bg-[#fbf7f2] transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-lg font-light italic text-[#9c7c3a] font-serif">₹{payment.amount.toFixed(2)}</p>
              <p className="text-sm italic text-[#666] flex items-center gap-1 mt-1 font-serif">
                <Calendar className="w-4 h-4 text-[#9c7c3a]" />
                {new Date(payment.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className={getStatusBadge(payment.status)}>
              {React.createElement(
                payment.status === 'pending' ? Clock :
                payment.status === 'approved' ? CheckCircle :
                payment.status === 'paid' ? CheckCircle : AlertCircle,
                { size: 12 }
              )}
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
            <div>
              <p className="text-[#666] text-xs italic font-serif">Total Sales</p>
              <p className="font-light italic text-[#3b3b3b] font-serif">₹{payment.breakdown?.totalSales.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-[#666] text-xs italic font-serif">Platform Fee</p>
              <p className="font-light italic text-[#3b3b3b] font-serif">₹{payment.breakdown?.platformFee.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <button
            onClick={() => onOpenModal(payment._id)}
            className="text-[#9c7c3a] hover:text-[#8a6a2f] font-light italic transition-colors flex items-center gap-1 text-sm font-serif"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>
      ))}
    </div>
  );
};

export default PaymentHistoryCards;