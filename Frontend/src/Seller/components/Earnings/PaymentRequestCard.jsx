import React from 'react';
import { Receipt } from 'lucide-react';

const PaymentRequestCard = ({ earnings, requesting, onRequestPayment }) => {
  if (!earnings) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 md:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-gray-600" />
            Request Payment
          </h3>
          <p className="text-sm text-gray-600 mb-2">Request payment for all pending sales</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <p className="text-sm font-medium text-gray-900">Amount: <span className="text-lg font-bold text-green-600">₹{earnings.totalPending.toFixed(2)}</span></p>
            <span className="hidden sm:block text-gray-300">•</span>
            <p className="text-xs text-gray-500">{earnings.paymentCount || 0} products pending</p>
          </div>
        </div>
        <button
          onClick={onRequestPayment}
          disabled={requesting || earnings.totalPending === 0}
          className="px-4 md:px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded-lg font-semibold transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px] lg:min-w-[160px]"
        >
          {requesting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Requesting...
            </>
          ) : (
            <>
              <Receipt className="w-4 h-4" />
              Request Payment
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentRequestCard;