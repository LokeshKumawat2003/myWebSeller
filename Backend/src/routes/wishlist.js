const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, wishlistController.getWishlist);
router.post('/items', verifyToken, wishlistController.addToWishlist);
router.delete('/items/:itemId', verifyToken, wishlistController.removeFromWishlist);
router.get('/status', verifyToken, wishlistController.checkWishlistStatus);

module.exports = router;