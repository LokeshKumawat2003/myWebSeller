const mongoose = require('mongoose');

const WishlistItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  variant: Object,
  addedAt: { type: Date, default: Date.now }
});

const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [WishlistItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', WishlistSchema);