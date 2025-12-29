const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.get('/sellers', verifyToken, authorizeRole('admin'), adminController.listSellers);
router.post('/sellers', verifyToken, authorizeRole('admin'), adminController.createSeller);
router.get('/admins', verifyToken, authorizeRole('admin'), adminController.listAdmins);
router.post('/sellers/:id/approve', verifyToken, authorizeRole('admin'), adminController.approveSeller);
router.post('/sellers/:id/block', verifyToken, authorizeRole('admin'), adminController.blockSeller);
router.post('/sellers/:id/unblock', verifyToken, authorizeRole('admin'), adminController.unblockSeller);
router.get('/products', verifyToken, authorizeRole('admin'), adminController.listProducts);
router.post('/products/:id/approve', verifyToken, authorizeRole('admin'), adminController.approveProduct);
router.get('/orders', verifyToken, authorizeRole('admin'), adminController.listOrders);
router.post('/orders/:id/deliver', verifyToken, authorizeRole('admin'), adminController.markOrderDelivered);
router.post('/seed-seller', verifyToken, authorizeRole('admin'), adminController.seedSeller);
router.post('/seed-categories', verifyToken, authorizeRole('admin'), adminController.seedCategories);
router.post('/seed-products', verifyToken, authorizeRole('admin'), adminController.seedProducts);

module.exports = router;