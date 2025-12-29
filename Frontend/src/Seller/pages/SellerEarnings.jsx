import React, { useEffect, useState } from 'react';
import { getSellerEarnings, getSellerPaymentHistory, requestPayment } from '../../services/sellerApi';
import { Wallet, Receipt } from 'lucide-react';
import EarningsSummary from '../components/Earnings/EarningsSummary';
import PaymentRequestCard from '../components/Earnings/PaymentRequestCard';
import PaymentHistoryTable from '../components/Earnings/PaymentHistoryTable';
import PaymentHistoryCards from '../components/Earnings/PaymentHistoryCards';
import PaymentBreakdown from '../components/Earnings/PaymentBreakdown';

const SellerEarnings = () => {
  const [earnings, setEarnings] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);

  useEffect(() => {
    fetchEarnings();
    fetchPaymentHistory();
  }, []);

  const fetchEarnings = async () => {
    setLoading(true);
    try {
      const data = await getSellerEarnings();
      console.log('Earnings data:', data);
      setEarnings(data);
    } catch (err) {
      console.error('Error fetching earnings:', err);
      alert('Error fetching earnings: ' + err.message);
    }
    setLoading(false);
  };

  const fetchPaymentHistory = async () => {
    try {
      const data = await getSellerPaymentHistory();
      console.log('Payment history data:', data);
      setPaymentHistory(data);
    } catch (err) {
      console.error('Error fetching payment history:', err);
      alert('Error fetching payment history: ' + err.message);
    }
  };

  const handleRequestPayment = async () => {
    if (!earnings || earnings.totalPending === 0) {
      alert('No pending earnings to request payment for');
      return;
    }
    setRequesting(true);
    try {
      const data = await requestPayment();
      alert('Payment request submitted successfully!');
      fetchEarnings();
      fetchPaymentHistory();
    } catch (err) {
      alert('Error requesting payment: ' + err.message);
    }
    setRequesting(false);
  };

  const handleOpenModal = (paymentId) => {
    setSelectedPaymentId(paymentId);
    setShowBreakdown(true);
  };

  const handleCloseModal = () => {
    setShowBreakdown(false);
    setSelectedPaymentId(null);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[#fbf7f2] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#3b3b3b] flex items-center gap-3 font-serif">
            <Wallet className="w-6 h-6 md:w-8 md:h-8 text-[#9c7c3a]" />
            Earnings & Payouts
          </h1>
          <p className="text-sm md:text-base text-[#666] mt-2 font-sans">Track your sales performance and manage payment requests</p>
        </div>

        {/* Earnings Summary */}
        <div className="mb-6 md:mb-8">
          <EarningsSummary earnings={earnings} loading={loading} />
        </div>

        {/* Payment Request */}
        {earnings && (
          <div className="mb-6 md:mb-8">
            <PaymentRequestCard
              earnings={earnings}
              requesting={requesting}
              onRequestPayment={handleRequestPayment}
            />
          </div>
        )}

        {/* Payment History */}
        <div className="bg-[#fbf7f2] rounded-xl shadow-md border border-[#e6ddd2] overflow-hidden">
          <div className="px-4 md:px-6 py-4 bg-[#f5f0e8] border-b border-[#e6ddd2]">
            <h2 className="text-lg md:text-xl font-bold text-[#3b3b3b] flex items-center gap-2 font-serif">
              <Receipt className="w-5 h-5 text-[#9c7c3a]" />
              Payment History
            </h2>
            <p className="text-xs md:text-sm text-[#666] mt-1 font-sans">View all your payment requests and their status</p>
          </div>

          {paymentHistory.length === 0 ? (
            <div className="px-4 md:px-6 py-8 md:py-12 text-center">
              <Receipt className="w-12 h-12 md:w-16 md:h-16 text-[#9c7c3a] mx-auto mb-4" />
              <h3 className="text-base md:text-lg font-semibold text-[#3b3b3b] mb-2 font-serif">No payment history yet</h3>
              <p className="text-sm text-[#666] font-sans">Your payment requests will appear here once submitted.</p>
            </div>
          ) : (
            <>
              <PaymentHistoryTable
                paymentHistory={paymentHistory}
                onOpenModal={handleOpenModal}
              />
              <PaymentHistoryCards
                paymentHistory={paymentHistory}
                onOpenModal={handleOpenModal}
              />
            </>
          )}
        </div>

        {/* Payment Breakdown Modal */}
        <PaymentBreakdown
          paymentHistory={paymentHistory}
          selectedPaymentId={selectedPaymentId}
          isOpen={showBreakdown}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default SellerEarnings;
