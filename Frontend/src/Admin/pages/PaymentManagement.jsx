import React, { useEffect, useState } from 'react';
import { adminListPayments, adminApprovePayment, adminRejectPayment, adminPayPayment, adminGetPaymentAnalytics } from '../../services/adminApi';
import PaymentAnalytics from '../components/Payment/PaymentAnalytics';
import PaymentStatusFilter from '../components/Payment/PaymentStatusFilter';
import PaymentsTable from '../components/Payment/PaymentsTable';
import PaymentRejectModal from '../components/Payment/PaymentRejectModal';

const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await adminListPayments(statusFilter, page, 50);
      setPayments(data.payments);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error('Error fetching payments:', err);
    }
    setLoading(false);
  };

  const fetchAnalytics = async () => {
    try {
      const data = await adminGetPaymentAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchAnalytics();
  }, [statusFilter, page]);

  const handleApprove = async (paymentId) => {
    if (window.confirm('Approve this payment request?')) {
      try {
        const result = await adminApprovePayment(paymentId);
        alert('Payment approved');
        fetchPayments();
        fetchAnalytics();
      } catch (err) {
        alert('Error approving payment: ' + err.message);
      }
    }
  };

  const handleReject = async (paymentId, reason) => {
    try {
      const result = await adminRejectPayment(paymentId, reason);
      alert('Payment rejected');
      fetchPayments();
      fetchAnalytics();
    } catch (err) {
      alert('Error rejecting payment: ' + err.message);
    }
  };

  const handlePay = async (paymentId) => {
    if (window.confirm('Mark this payment as paid?')) {
      try {
        const result = await adminPayPayment(paymentId);
        alert('Payment processed');
        fetchPayments();
        fetchAnalytics();
      } catch (err) {
        alert('Error processing payment: ' + err.message);
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Payment Management</h1>

      {/* Analytics Cards */}
      {analytics && <div className="mb-8"><PaymentAnalytics analytics={analytics} /></div>}

      {/* Status Filter */}
      <div className="mb-6">
        <PaymentStatusFilter statusFilter={statusFilter} onStatusChange={(status) => { setStatusFilter(status); setPage(1); }} />
      </div>

      {/* Payments Table */}
      <div className="mb-6">
        <PaymentsTable
          payments={payments}
          loading={loading}
          onApprove={handleApprove}
          onReject={(payment) => { setSelectedPayment(payment); setShowRejectModal(true); }}
          onPay={handlePay}
        />
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700 font-medium">Page {page} of {pages}</span>
          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Reject Reason Modal */}
      <PaymentRejectModal
        isOpen={showRejectModal}
        onClose={() => { setShowRejectModal(false); setSelectedPayment(null); }}
        onConfirm={handleReject}
        payment={selectedPayment}
      />
    </div>
  );
};

export default PaymentManagement;
