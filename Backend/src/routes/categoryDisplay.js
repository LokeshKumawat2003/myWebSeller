const express = require('express');
const router = express.Router();
const categoryDisplayController = require('../controllers/categoryDisplayController');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Public routes
router.get('/', categoryDisplayController.listCategoryDisplays);
router.get('/:id', categoryDisplayController.getCategoryDisplay);

// Admin routes
router.get('/admin/all', verifyToken, authorizeRole('admin'), categoryDisplayController.getAllCategoryDisplays);
router.post('/', verifyToken, authorizeRole('admin'), upload.single('image'), categoryDisplayController.createCategoryDisplay);
router.put('/:id', verifyToken, authorizeRole('admin'), upload.single('image'), categoryDisplayController.updateCategoryDisplay);
router.delete('/:id', verifyToken, authorizeRole('admin'), categoryDisplayController.deleteCategoryDisplay);

module.exports = router;
