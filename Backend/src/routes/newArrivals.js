const express = require('express');
const router = express.Router();
const newArrivalController = require('../controllers/newArrivalController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.get('/', newArrivalController.getNewArrivals);

// Admin routes
router.get('/admin/list', verifyToken, authorizeRole('admin'), newArrivalController.listNewArrivals);
router.post('/admin/:productId', verifyToken, authorizeRole('admin'), newArrivalController.addToNewArrivals);
router.delete('/admin/:productId', verifyToken, authorizeRole('admin'), newArrivalController.removeFromNewArrivals);
router.put('/admin/order/:productId', verifyToken, authorizeRole('admin'), newArrivalController.updateNewArrivalOrder);

module.exports = router;