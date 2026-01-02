import React from 'react';
import { CreditCard, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';

const PaymentHeader = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-indigo-100 mt-1">Manage seller payment requests and payouts</p>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

const PaymentAnalytics = ({ analytics }) => {
  if (!analytics) return null;

  const cards = [
    {
      title: 'Total Requested',
      value: `₹${analytics.totalRequested.toFixed(2)}`,
      subtitle: `${analytics.paymentCounts.pending} pending`,
      icon: Clock,
      color: 'bg-amber-500'
    },
    {
      title: 'Total Approved',
      value: `₹${analytics.totalApproved.toFixed(2)}`,
      subtitle: `${analytics.paymentCounts.approved} approved`,
      icon: CheckCircle,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Paid',
      value: `₹${analytics.totalPaid.toFixed(2)}`,
      subtitle: `${analytics.paymentCounts.paid} paid`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Rejected',
      value: `₹${analytics.totalRejected.toFixed(2)}`,
      subtitle: `${analytics.paymentCounts.rejected} rejected`,
      icon: XCircle,
      color: 'bg-red-500'
    },
    {
      title: 'Total Payments',
      value: analytics.totalPayments,
      subtitle: 'All time',
      icon: CreditCard,
      color: 'bg-indigo-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, index) => (
        <div key={index} className="luxury-bg rounded-xl shadow-sm luxury-border p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium italic luxury-text-secondary mb-1">{card.title}</p>
              <p className="text-2xl font-bold italic luxury-text-primary mb-1">{card.value}</p>
              <p className="text-xs italic luxury-text-secondary">{card.subtitle}</p>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export { PaymentHeader };
export default PaymentAnalytics;