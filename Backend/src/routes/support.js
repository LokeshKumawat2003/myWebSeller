const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.post('/', verifyToken, supportController.createTicket);
router.get('/', verifyToken, supportController.listTickets);
router.post('/:id/message', verifyToken, supportController.postMessage);

// Admin routes
router.get('/all', verifyToken, authorizeRole('admin'), supportController.listAllTickets);
router.put('/:id/assign', verifyToken, authorizeRole('admin'), supportController.assignTicket);
router.put('/:id/status', verifyToken, authorizeRole(['admin', 'seller']), supportController.updateStatus);

// Seller routes
router.get('/assigned', verifyToken, authorizeRole(['admin', 'seller']), supportController.listAssignedTickets);
router.post('/:id/support-message', verifyToken, authorizeRole(['admin', 'seller']), supportController.postSupportMessage);

module.exports = router;