const Payment = require('../models/Payment');
const Seller = require('../models/Seller');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// Seller: Request payment/payout
exports.requestPayment = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) return res.status(400).json({ message: 'Seller profile not found' });

    // Find all delivered orders belonging to this seller that haven't been paid out
    const orders = await Order.find({
      'items.seller': seller._id,
      status: 'delivered',
    }).populate('items.product');

    if (orders.length === 0) {
      return res.status(400).json({ message: 'No delivered orders to request payment for' });
    }

    // Calculate total sales from seller's items
    let totalSales = 0;
    const productIds = new Set();
    const orderIds = [];

    for (const order of orders) {
      for (const item of order.items) {
        if (String(item.seller) === String(seller._id)) {
          totalSales += item.qty * item.price;
          if (item.product) productIds.add(String(item.product._id));
        }
      }
      orderIds.push(order._id);
    }

    // Calculate fees and net amount (10% platform fee as example)
    const platformFee = totalSales * 0.1;
    const netAmount = totalSales - platformFee;

    // Check if seller already has a pending payment request
    const existingPending = await Payment.findOne({
      seller: seller._id,
      status: 'pending',
    });
    if (existingPending) {
      return res.status(400).json({ message: 'You already have a pending payment request' });
    }

    const payment = new Payment({
      seller: seller._id,
      user: req.user._id,
      amount: netAmount,
      orderIds,
      productIds: Array.from(productIds),
      breakdown: {
        totalSales,
        platformFee,
        netAmount,
      },
    });

    await payment.save();
    res.status(201).json({ message: 'Payment request created', payment });
  } catch (err) {
    res.status(500).json({ message: 'Error requesting payment', error: err.message });
  }
};

// Seller: Get their payment history
exports.getSellerPaymentHistory = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) return res.status(400).json({ message: 'Seller profile not found' });

    const payments = await Payment.find({ seller: seller._id })
      .sort({ createdAt: -1 })
      .populate('approvedBy', 'name email')
      .populate('paidBy', 'name email')
      .lean();

    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payment history', error: err.message });
  }
};

// Seller: Get earnings summary (total sales, pending, paid, etc.)
exports.getSellerEarnings = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });
    if (!seller) return res.status(400).json({ message: 'Seller profile not found' });

    // Get all payments for this seller
    const payments = await Payment.find({ seller: seller._id });

    let totalEarned = 0;
    let totalPendingPayments = 0;
    let totalApproved = 0;
    let totalRequestedSales = 0; // Total from payment requests

    for (const p of payments) {
      if (p.status === 'paid') totalEarned += p.amount;
      else if (p.status === 'pending') totalPendingPayments += p.amount;
      else if (p.status === 'approved') totalApproved += p.amount;
      
      // Sum all request totals (pending, approved, or paid)
      if (p.status !== 'rejected') {
        totalRequestedSales += p.breakdown?.totalSales || 0;
      }
    }

    // Get all delivered orders for this seller
    const orders = await Order.find({ 'items.seller': seller._id, status: 'delivered' });
    let totalSales = 0;
    for (const order of orders) {
      for (const item of order.items) {
        if (String(item.seller) === String(seller._id)) {
          totalSales += item.qty * item.price;
        }
      }
    }

    // Calculate available pending earnings (delivered sales not yet requested)
    const unrequestedSales = Math.max(0, totalSales - totalRequestedSales);
    const platformFee = unrequestedSales * 0.1;
    const availablePending = unrequestedSales - platformFee;

    res.json({
      totalSales,
      totalEarned,
      totalPending: availablePending, // Available earnings (not yet requested)
      totalApproved,
      paymentCount: payments.length,
      totalRequestedSales, // For debugging
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching earnings', error: err.message });
  }
};

// Admin: List all payment requests
exports.adminListPayments = async (req, res) => {
  try {
    const { status = '', page = 1, limit = 50 } = req.query;
    let filter = {};
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const payments = await Payment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('seller', 'storeName user')
      .populate('user', 'name email')
      .populate('approvedBy', 'name email')
      .populate('paidBy', 'name email')
      .lean();

    const total = await Payment.countDocuments(filter);
    res.json({ payments, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching payments', error: err.message });
  }
};

// Admin: Approve payment request
exports.adminApprovePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'approved';
    payment.approvedAt = new Date();
    payment.approvedBy = req.user._id;
    await payment.save();

    res.json({ message: 'Payment approved', payment });
  } catch (err) {
    res.status(500).json({ message: 'Error approving payment', error: err.message });
  }
};

// Admin: Reject payment request
exports.adminRejectPayment = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'rejected';
    payment.rejectionReason = rejectionReason || 'No reason provided';
    await payment.save();

    res.json({ message: 'Payment rejected', payment });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting payment', error: err.message });
  }
};

// Admin: Mark payment as paid
exports.adminPayPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.status !== 'approved') {
      return res.status(400).json({ message: 'Only approved payments can be marked as paid' });
    }

    payment.status = 'paid';
    payment.paidAt = new Date();
    payment.paidBy = req.user._id;
    await payment.save();

    res.json({ message: 'Payment processed', payment });
  } catch (err) {
    res.status(500).json({ message: 'Error processing payment', error: err.message });
  }
};

// Admin: Get payment analytics/dashboard
exports.adminGetPaymentAnalytics = async (req, res) => {
  try {
    const payments = await Payment.find();

    let totalRequested = 0;
    let totalApproved = 0;
    let totalPaid = 0;
    let totalRejected = 0;
    const paymentCounts = { pending: 0, approved: 0, paid: 0, rejected: 0 };

    for (const p of payments) {
      if (p.status === 'pending') {
        totalRequested += p.amount;
        paymentCounts.pending += 1;
      } else if (p.status === 'approved') {
        totalApproved += p.amount;
        paymentCounts.approved += 1;
      } else if (p.status === 'paid') {
        totalPaid += p.amount;
        paymentCounts.paid += 1;
      } else if (p.status === 'rejected') {
        totalRejected += p.amount;
        paymentCounts.rejected += 1;
      }
    }

    res.json({
      totalRequested,
      totalApproved,
      totalPaid,
      totalRejected,
      paymentCounts,
      totalPayments: payments.length,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics', error: err.message });
  }
};
