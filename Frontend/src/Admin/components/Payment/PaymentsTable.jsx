import React from 'react';
import { Check, X, DollarSign, Calendar, Store, User, Loader2 } from 'lucide-react';
import { Card, Button, Badge } from '../UI';

const PaymentsTable = ({ payments, loading, onApprove, onReject, onPay }) => {
  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      approved: 'primary',
      paid: 'success',
      rejected: 'danger',
    };
    return variants[status] || 'default';
  };

  if (loading) {
    return (
      <Card padding="p-12">
        <div className="flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin luxury-accent mr-3" />
          <p className="luxury-text-secondary font-medium">Loading payments...</p>
        </div>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card padding="p-12">
        <div className="text-center">
          <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium luxury-text-primary mb-2">No payments found</h3>
          <p className="luxury-text-secondary">Payment requests will appear here once sellers request payouts</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="luxury-bg-secondary luxury-border">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Seller</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Total Sales</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Platform Fee</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Requested</th>
              <th className="px-6 py-4 text-left text-xs font-semibold luxury-text-secondary uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y luxury-border">
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-luxury-bg-secondary transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 luxury-bg-secondary rounded-full flex items-center justify-center">
                        <Store className="w-5 h-5 luxury-accent" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium luxury-text-primary">
                        {payment.seller?.storeName || 'N/A'}
                      </div>
                      <div className="text-sm luxury-text-secondary flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {payment.user?.email || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-semibold luxury-text-primary">
                      ₹{payment.amount.toFixed(2)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm luxury-text-primary">
                  ₹{payment.breakdown?.totalSales.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4 text-sm luxury-text-primary">
                  ₹{payment.breakdown?.platformFee.toFixed(2) || '0.00'}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={getStatusBadge(payment.status)}>
                    {payment.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm luxury-text-secondary">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {payment.status === 'pending' && (
                      <>
                        <Button
                          variant="primary"
                          size="small"
                          onClick={() => onApprove(payment._id)}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="danger"
                          size="small"
                          onClick={() => onReject(payment)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    {payment.status === 'approved' && (
                      <Button
                        variant="success"
                        size="small"
                        onClick={() => onPay(payment._id)}
                      >
                        <DollarSign className="w-4 h-4 mr-1" />
                        Mark Paid
                      </Button>
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
    </Card>
  );
};

export default PaymentsTable;