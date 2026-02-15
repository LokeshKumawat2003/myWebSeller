const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public endpoints
router.get('/', productController.listProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new-arrivals', productController.getNewArrivals);

// Admin endpoints
router.get('/admin/all', verifyToken, authorizeRole('admin'), productController.adminListProducts);
router.put('/admin/:id/status', verifyToken, authorizeRole('admin'), productController.adminUpdateProductStatus);
router.post('/admin/:id/block', verifyToken, authorizeRole('admin'), productController.adminBlockProduct);
router.post('/admin/:id/unblock', verifyToken, authorizeRole('admin'), productController.adminUnblockProduct);
router.put('/admin/:id/featured', verifyToken, authorizeRole('admin'), productController.adminToggleFeatured);
router.put('/admin/:id/trending', verifyToken, authorizeRole('admin'), productController.adminToggleTrending);
router.put('/admin/:id/new', verifyToken, authorizeRole('admin'), productController.adminToggleNew);
router.delete('/admin/:id', verifyToken, authorizeRole('admin'), productController.adminDeleteProduct);

// Seller-specific endpoints (place before the dynamic `/:id` route)
router.get('/seller/my-products', verifyToken, authorizeRole('seller'), productController.getSellerProducts);
router.get('/:id', productController.getProduct);

// Seller endpoints
router.post('/', verifyToken, authorizeRole('seller'), upload.array('images', 10), productController.createProduct);
router.put('/:id', verifyToken, authorizeRole(['seller', 'admin']), upload.array('images', 10), productController.updateProduct);
router.delete('/:id', verifyToken, authorizeRole(['seller', 'admin']), productController.deleteProduct);

module.exports = router;
