import React from 'react';
import { Clock, CheckCircle, AlertCircle, Calendar, Eye, EyeOff } from 'lucide-react';

const PaymentHistoryTable = ({ paymentHistory, onOpenModal }) => {
  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      approved: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: CheckCircle },
      paid: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: AlertCircle },
    };
    const config = configs[status] || { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: AlertCircle };
    const IconComponent = config.icon;

    return `px-3 py-1 rounded-full text-xs font-semibold border ${config.color} flex items-center gap-1 w-fit`;
  };

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-800">Amount</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-800">Total Sales</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-800">Platform Fee</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-800">Status</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-800">Requested</th>
            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-800">Details</th>
          </tr>
        </thead>
        <tbody>
          {paymentHistory.map(payment => (
            <tr key={payment._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 md:px-6 py-4 text-sm font-semibold text-gray-900">₹{payment.amount.toFixed(2)}</td>
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-700">₹{payment.breakdown?.totalSales.toFixed(2) || '0.00'}</td>
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-700">₹{payment.breakdown?.platformFee.toFixed(2) || '0.00'}</td>
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
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-600 flex items-center gap-2">
                <Calendar className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
                <button
                  onClick={() => onOpenModal(payment._id)}
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors flex items-center gap-1"
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