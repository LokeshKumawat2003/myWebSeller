import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar, Eye, EyeOff } from 'lucide-react';

const PaymentHistoryCards = ({ paymentHistory, onOpenModal }) => {
  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      approved: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      paid: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
    };
    const config = configs[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle };
    const IconComponent = config.icon;

    return `px-2 py-1 rounded-full text-xs font-semibold border ${config.color} flex items-center gap-1 w-fit`;
  };

  return (
    <div className="md:hidden">
      {paymentHistory.map(payment => (
        <div key={payment._id} className="border-b border-gray-100 p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-lg font-semibold text-gray-900">₹{payment.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                <Calendar className="w-4 h-4" />
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
              <p className="text-gray-600 text-xs">Total Sales</p>
              <p className="font-medium">₹{payment.breakdown?.totalSales.toFixed(2) || '0.00'}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs">Platform Fee</p>
              <p className="font-medium">₹{payment.breakdown?.platformFee.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <button
            onClick={() => onOpenModal(payment._id)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1 text-sm"
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