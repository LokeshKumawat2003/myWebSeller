const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.post('/register', verifyToken, sellerController.requestSeller);
router.get('/me', verifyToken, sellerController.getSeller);
router.get('/orders', verifyToken, authorizeRole('seller'), sellerController.getSellerOrders);

module.exports = router;