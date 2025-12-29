const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'paid', 'rejected'],
      default: 'pending',
    },
    orderIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Orders contributing to this payout request
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Products sold in these orders
    breakdown: {
      totalSales: Number, // Total sales amount from orders
      platformFee: Number, // Platform fee (e.g., 10%)
      netAmount: Number, // Amount after deducting fees
    },
    requestedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who approved
    paidAt: { type: Date },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who processed payment
    rejectionReason: String, // If status is 'rejected'
    notes: String, // Additional notes
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);
