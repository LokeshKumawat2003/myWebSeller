const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.post('/checkout', verifyToken, orderController.checkout);
router.get('/', verifyToken, orderController.listUserOrders);
router.get('/:id', verifyToken, orderController.getOrder);
router.get('/:id/track', verifyToken, orderController.trackOrder);
router.put('/:id/status', verifyToken, authorizeRole(['admin', 'seller']), orderController.updateOrderStatus);

module.exports = router;
