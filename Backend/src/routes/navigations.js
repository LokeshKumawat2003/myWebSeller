const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

router.get('/', navigationController.listNavigations);
router.get('/:id', navigationController.getNavigation);
router.post('/', verifyToken, authorizeRole('admin'), navigationController.createNavigation);
router.put('/:id', verifyToken, authorizeRole('admin'), navigationController.updateNavigation);
router.delete('/:id', verifyToken, authorizeRole('admin'), navigationController.deleteNavigation);

module.exports = router;