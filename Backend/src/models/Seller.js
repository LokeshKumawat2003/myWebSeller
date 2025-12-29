const mongoose = require('mongoose');

const SellerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  storeName: { type: String },
  logoUrl: String,
  bannerUrl: String,
  approved: { type: Boolean, default: false },
  earnings: { type: Number, default: 0 },
  pendingPayout: { type: Number, default: 0 },
  blocked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Seller', SellerSchema);
