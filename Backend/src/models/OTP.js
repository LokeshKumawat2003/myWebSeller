const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  email: { type: String },
  name: { type: String },
  expiresAt: { type: Date, required: true, index: { expires: 300 } }, // 5 minutes expiry
  attempts: { type: Number, default: 0, max: 5 },
  verified: { type: Boolean, default: false },
  type: { type: String, enum: ['login', 'register'], default: 'login' }, // OTP purpose
}, { timestamps: true });

// Auto delete expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', OTPSchema);
