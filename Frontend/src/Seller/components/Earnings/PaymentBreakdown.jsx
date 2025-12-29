import React from 'react';
import { Receipt, X } from 'lucide-react';

const PaymentBreakdownModal = ({ paymentHistory, selectedPaymentId, isOpen, onClose }) => {
  if (!isOpen || !selectedPaymentId) return null;

  const payment = paymentHistory.find(p => p._id === selectedPaymentId);
  if (!payment?.breakdown) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-sm border border-[#e6ddd2] w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-[#e6ddd2]">
          <h3 className="text-lg md:text-xl font-light italic text-[#3b3b3b] flex items-center gap-2 font-serif">
            <Receipt className="w-5 h-5 md:w-6 md:h-6 text-[#9c7c3a]" />
            Payment Breakdown
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#fbf7f2] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#666]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6">
          {/* Payment Info */}
          <div className="mb-6 p-4 bg-[#fbf7f2] rounded-lg border border-[#e6ddd2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm italic text-[#666] font-serif">Payment Amount</span>
              <span className="text-lg font-light italic text-[#9c7c3a] font-serif">₹{payment.amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm italic text-[#666] font-serif">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs font-light italic font-serif ${
                payment.status === 'paid' ? 'bg-[#9c7c3a] text-white' :
                payment.status === 'approved' ? 'bg-[#fbf7f2] text-[#9c7c3a] border border-[#e6ddd2]' :
                payment.status === 'pending' ? 'bg-[#e6ddd2] text-[#3b3b3b]' :
                'bg-[#e6ddd2] text-[#666]'
              }`}>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Breakdown Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-[#e6ddd2]">
              <span className="text-[#666] font-light italic font-serif">Total Sales:</span>
              <span className="font-light italic text-[#3b3b3b] font-serif">₹{payment.breakdown.totalSales.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-[#e6ddd2]">
              <span className="text-[#666] font-light italic font-serif">Platform Fee (10%):</span>
              <span className="font-light italic text-red-600 font-serif">- ₹{payment.breakdown.platformFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-3 text-lg border-t border-[#e6ddd2] pt-4">
              <span className="font-light italic text-[#3b3b3b] font-serif">Net Amount:</span>
              <span className="font-light italic text-[#9c7c3a] font-serif">₹{payment.breakdown.netAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-[#e6ddd2]">
            <div className="text-xs italic text-[#666] text-center font-serif">
              Requested on {new Date(payment.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-4 md:p-6 border-t border-[#e6ddd2] bg-[#fbf7f2]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[#666] bg-white border border-[#e6ddd2] rounded-lg hover:bg-[#fbf7f2] transition-colors font-light italic font-serif"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentBreakdownModal;