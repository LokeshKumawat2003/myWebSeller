const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', bannerController.listBanners);
router.post('/', verifyToken, authorizeRole('admin'), upload.single('image'), bannerController.createBanner);
router.put('/:id', verifyToken, authorizeRole('admin'), upload.single('image'), bannerController.updateBanner);
router.delete('/:id', verifyToken, authorizeRole('admin'), bannerController.deleteBanner);

module.exports = router;