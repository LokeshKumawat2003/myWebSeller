const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, cartController.getCart);
router.post('/items', verifyToken, cartController.addItem);
router.put('/items/:itemId', verifyToken, cartController.updateItem);
router.delete('/items/:itemId', verifyToken, cartController.removeItem);

module.exports = router;