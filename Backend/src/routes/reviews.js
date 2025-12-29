const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.post('/', verifyToken, authorizeRole('user'), reviewController.createReview);
router.get('/product/:productId', reviewController.listProductReviews);
router.delete('/:id', verifyToken, authorizeRole('admin'), reviewController.deleteReview);

module.exports = router;
