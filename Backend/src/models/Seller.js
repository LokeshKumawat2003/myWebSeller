const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
  accountName: String,
  accountNumber: String,
  ifsc: String,
  bankName: String,
  branch: String,
});

const UpiSchema = new mongoose.Schema({
  upiId: String,
});

const PayoutSchema = new mongoose.Schema({
  bank: BankSchema,
  upi: UpiSchema,
  verified: { type: Boolean, default: false },
  addedAt: Date,
});

const PayoutChangeRequestSchema = new mongoose.Schema({
  old: PayoutSchema,
  new: PayoutSchema,
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminComment: String,
  requestedAt: { type: Date, default: Date.now },
  reviewedAt: Date,
});

const SellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeName: { type: String },
  logoUrl: String,
  bannerUrl: String,
  approved: { type: Boolean, default: false },
  earnings: { type: Number, default: 0 },
  pendingPayout: { type: Number, default: 0 },
  blocked: { type: Boolean, default: false },
  payout: PayoutSchema,
  payoutChangeRequests: [PayoutChangeRequestSchema],
}, { timestamps: true });

module.exports = mongoose.model('Seller', SellerSchema);
