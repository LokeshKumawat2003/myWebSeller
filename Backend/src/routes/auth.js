const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Address management routes
router.get('/addresses', authMiddleware.verifyToken, authController.getUserAddresses);
router.post('/addresses', authMiddleware.verifyToken, authController.addUserAddress);
router.put('/addresses/:addressId', authMiddleware.verifyToken, authController.updateUserAddress);
router.delete('/addresses/:addressId', authMiddleware.verifyToken, authController.deleteUserAddress);

module.exports = router;
