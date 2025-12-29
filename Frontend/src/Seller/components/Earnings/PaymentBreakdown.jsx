import React from 'react';
import { Receipt, X } from 'lucide-react';

const PaymentBreakdownModal = ({ paymentHistory, selectedPaymentId, isOpen, onClose }) => {
  if (!isOpen || !selectedPaymentId) return null;

  const payment = paymentHistory.find(p => p._id === selectedPaymentId);
  if (!payment?.breakdown) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
          <h3 className="text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            Payment Breakdown
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6">
          {/* Payment Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Payment Amount</span>
              <span className="text-lg font-bold text-gray-900">₹{payment.amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                payment.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Breakdown Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Total Sales:</span>
              <span className="font-semibold text-gray-900">₹{payment.breakdown.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-700 font-medium">Platform Fee (10%):</span>
              <span className="font-semibold text-red-600">- ₹{payment.breakdown.platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 text-lg border-t border-gray-200 pt-4">
              <span className="font-bold text-gray-900">Net Amount:</span>
              <span className="font-bold text-green-600">₹{payment.breakdown.netAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center">
              Requested on {new Date(payment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-4 md:p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentBreakdownModal;