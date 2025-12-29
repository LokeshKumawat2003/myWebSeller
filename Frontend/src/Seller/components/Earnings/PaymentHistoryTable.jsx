import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar, Eye, EyeOff } from 'lucide-react';

const PaymentHistoryTable = ({ paymentHistory, onOpenModal }) => {
  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'bg-[#e6ddd2] text-[#3b3b3b] border-[#9c7c3a]', icon: Clock },
      approved: { color: 'bg-[#f5f0e8] text-[#9c7c3a] border-[#e6ddd2]', icon: CheckCircle },
      paid: { color: 'bg-[#9c7c3a] text-white', icon: CheckCircle },
      rejected: { color: 'bg-[#e6ddd2] text-[#666] border-[#9c7c3a]', icon: AlertCircle },
    };
    const config = configs[status] || { color: 'bg-[#e6ddd2] text-[#666] border-[#e6ddd2]', icon: AlertCircle };
    const IconComponent = config.icon;

    return `px-3 py-1 rounded-full text-xs font-semibold border ${config.color} flex items-center gap-1 w-fit font-sans`;
  };

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#fbf7f2]">
          <tr>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-light italic text-[#666] font-serif">Amount</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-light italic text-[#666] font-serif">Total Sales</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-light italic text-[#666] font-serif">Platform Fee</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-light italic text-[#666] font-serif">Status</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-light italic text-[#666] font-serif">Requested</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-light italic text-[#666] font-serif">Details</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map(payment => (
            <tr key={payment._id} className="border-t border-[#e6ddd2] hover:bg-[#fbf7f2] transition-colors">
              <td className="px-4 md:px-6 py-4 text-sm font-light italic text-[#9c7c3a] font-serif">₹{payment.amount.toFixed(2)}</td>
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm italic text-[#666] font-serif">₹{payment.breakdown?.totalSales.toFixed(2) || '0.00'}</td>
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm italic text-[#666] font-serif">₹{payment.breakdown?.platformFee.toFixed(2) || '0.00'}</td>
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                <span className={getStatusBadge(payment.status)}>
                  {React.createElement(
                    payment.status === 'pending' ? Clock :
                    payment.status === 'approved' ? CheckCircle :
                    payment.status === 'paid' ? CheckCircle : AlertCircle,
                    { size: 12 }
                  )}
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </td>
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm italic text-[#666] flex items-center gap-2 font-serif">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-[#9c7c3a]" />
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                <button
                  onClick={() => onOpenModal(payment._id)}
                  className="text-[#9c7c3a] hover:text-[#8a6a2f] font-light italic transition-colors flex items-center gap-1 font-serif"
                >
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistoryTable;