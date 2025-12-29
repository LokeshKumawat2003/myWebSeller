import React from 'react';
import { Receipt } from 'lucide-react';

const PaymentRequestCard = ({ earnings, requesting, onRequestPayment }) => {
  if (!earnings) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#e6ddd2] p-6 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-light italic text-[#3b3b3b] mb-3 flex items-center gap-2 font-serif">
            <Receipt className="w-5 h-5 text-[#9c7c3a]" />
            Request Payment
          </h3>
          <p className="text-sm italic text-[#666] mb-4 font-serif">Request payment for all pending sales</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm italic text-[#3b3b3b] font-serif">Amount: <span className="text-xl font-light italic text-[#9c7c3a] font-serif">₹{earnings.totalPending.toFixed(2)}</span></p>
            <span className="hidden sm:block text-[#e6ddd2] text-xl">•</span>
            <p className="text-xs italic text-[#999] font-serif">{earnings.paymentCount || 0} products pending</p>
          </div>
        </div>
        <button
          onClick={onRequestPayment}
          disabled={requesting || earnings.totalPending === 0}
          className="px-6 py-3 bg-[#9c7c3a] hover:bg-[#8a6a2f] disabled:bg-[#e6ddd2] text-white disabled:text-[#666] rounded-lg font-light italic transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px] lg:min-w-[160px] font-serif hover:shadow-lg"
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