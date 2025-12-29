const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  replies: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, comment: String, createdAt: Date }],
  approved: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
