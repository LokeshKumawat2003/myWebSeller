const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET_KEY,
});

async function createOrder({ amount, currency = 'INR', receipt = '', notes = {} }) {
  // amount should be in smallest currency unit (paise for INR)
  try {
    return await razorpay.orders.create({ amount, currency, receipt, notes });
  } catch (err) {
    // Normalize error shape coming from razorpay SDK
    const e = err && err.error ? err.error : err;
    const message = (e && (e.description || e.reason || e.message)) || err.message || String(err);
    const out = new Error(`Razorpay createOrder failed: ${message}`);
    out.raw = err;
    throw out;
  }
}

function verifyPaymentSignature({ order_id, payment_id, signature }) {
  const generated = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    .update(`${order_id}|${payment_id}`)
    .digest('hex');
  return generated === signature;
}

function verifyWebhookSignature(rawBody, signature) {
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
    .update(rawBody)
    .digest('hex');
  return expected === signature;
}

module.exports = {
  createOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  razorpay,
};
