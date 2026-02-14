const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  variant: Object,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller' },
  qty: Number,
  price: Number,
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [OrderItemSchema],
  shippingAddress: Object,
  payment: Object,
  status: { type: String, enum: ['pending','packed','shipped','out_for_delivery','delivered','cancelled'], default: 'pending' },
  totals: Object,
  deliveryDate: Date, // Expected delivery date (7 days after shipped)
  shippedAt: Date, // When order was marked as shipped
  awb: String, // Airway Bill Number from ShipRocket
  courierName: String, // Courier name
  trackingUrl: String, // Tracking URL
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
