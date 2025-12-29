const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.get('/', categoryController.listCategories);
router.get('/:id', categoryController.getCategory);
router.post('/', verifyToken, authorizeRole('admin'), categoryController.createCategory);
router.put('/:id', verifyToken, authorizeRole('admin'), categoryController.updateCategory);
router.delete('/:id', verifyToken, authorizeRole('admin'), categoryController.deleteCategory);

module.exports = router;
