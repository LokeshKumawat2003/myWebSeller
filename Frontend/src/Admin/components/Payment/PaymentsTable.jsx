import React from 'react';
import { Check, X, DollarSign, Calendar, Store, User, Loader2 } from 'lucide-react';

const PaymentsTable = ({ payments, loading, onApprove, onReject, onPay }) => {
  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-800',
      approved: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mr-3" />
          <p className="text-gray-600 font-medium">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="text-center">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payments found</h3>
          <p className="text-gray-600">Payment requests will appear here once sellers request payouts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Seller</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total Sales</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Platform Fee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requested</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Store className="w-5 h-5 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.seller?.storeName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {payment.user?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{payment.amount.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₹{payment.breakdown?.totalSales.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  ₹{payment.breakdown?.platformFee.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4">
                  <span className={getStatusBadge(payment.status)}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {payment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onApprove(payment._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => onReject(payment)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </button>
                      </>
                    )}
                    {payment.status === 'approved' && (
                      <button
                        onClick={() => onPay(payment._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Mark Paid
                      </button>
                    )}
                    {payment.status === 'rejected' && (
                      <div className="text-xs text-red-600 max-w-32 truncate">
                        {payment.rejectionReason || 'Rejected'}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsTable;