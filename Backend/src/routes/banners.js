const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.get('/', bannerController.listBanners);
router.post('/', verifyToken, authorizeRole('admin'), bannerController.createBanner);
router.put('/:id', verifyToken, authorizeRole('admin'), bannerController.updateBanner);
router.delete('/:id', verifyToken, authorizeRole('admin'), bannerController.deleteBanner);

module.exports = router;