import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal, Textarea, Button } from '../UI';

const PaymentRejectModal = ({ isOpen, onClose, onConfirm, payment }) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setLoading(true);
    try {
      await onConfirm(payment._id, reason);
      setReason('');
      onClose();
    } catch (error) {
      console.error('Error rejecting payment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          Reject Payment Request
        </div>
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleSubmit}
            disabled={!reason.trim() || loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Rejecting...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Reject Payment
              </>
            )}
          </Button>
        </>
      }
    >
      <div className="mb-4">
        <p className="text-sm luxury-text-secondary mb-3">
          Please provide a reason for rejecting this payment request from{' '}
          <span className="font-medium luxury-text-primary">
            {payment?.seller?.storeName || 'the seller'}
          </span>
          {' '}for ₹{payment?.amount?.toFixed(2) || '0.00'}.
        </p>
      </div>

      <Textarea
        label="Rejection Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Enter the reason for rejection..."
        required
        rows={4}
      />
    </Modal>
  );
};

export default PaymentRejectModal;