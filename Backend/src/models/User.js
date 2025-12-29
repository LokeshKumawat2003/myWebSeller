const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  country: String,
  pincode: String,
  isDefault: { type: Boolean, default: false },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'seller', 'admin'], default: 'user' },
  phone: String,
  addresses: [AddressSchema],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
