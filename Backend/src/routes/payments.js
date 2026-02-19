const express = require('express');
const router = express.Router();
const { requireAuth, isSeller, isAdmin } = require('../middleware/auth');
const {
  requestPayment,
  getSellerPaymentHistory,
  getSellerEarnings,
  adminListPayments,
  adminApprovePayment,
  adminRejectPayment,
  adminPayPayment,
  adminGetPaymentAnalytics,
  getPublicKey,
  createOrder,
  verifyPayment,
  razorpayWebhook,
} = require('../controllers/paymentController');

// Seller routes
router.post('/request', requireAuth, isSeller, requestPayment);
router.get('/history', requireAuth, isSeller, getSellerPaymentHistory);
router.get('/earnings', requireAuth, isSeller, getSellerEarnings);

// Payment gateway endpoints
router.post('/create-order', requireAuth, createOrder);
// Publicly accessible Razorpay public key (runtime config)
router.get('/key', getPublicKey);
router.post('/verify', requireAuth, verifyPayment);
// Razorpay will POST webhooks to this endpoint; do NOT require auth
router.post('/webhook', razorpayWebhook);

// Admin routes
router.get('/admin/list', requireAuth, isAdmin, adminListPayments);
router.post('/admin/:id/approve', requireAuth, isAdmin, adminApprovePayment);
router.post('/admin/:id/reject', requireAuth, isAdmin, adminRejectPayment);
router.post('/admin/:id/pay', requireAuth, isAdmin, adminPayPayment);
router.get('/admin/analytics', requireAuth, isAdmin, adminGetPaymentAnalytics);

module.exports = router;