const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const passport = require('passport');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: process.env.CLIENT_URL || 'http://localhost:3000/login' }), authController.googleCallback);

// Address management routes
router.get('/addresses', authMiddleware.verifyToken, authController.getUserAddresses);
router.post('/addresses', authMiddleware.verifyToken, authController.addUserAddress);
router.put('/addresses/:addressId', authMiddleware.verifyToken, authController.updateUserAddress);
router.delete('/addresses/:addressId', authMiddleware.verifyToken, authController.deleteUserAddress);

module.exports = router;
