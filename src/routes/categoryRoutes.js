const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, categoryController.getAllCategories);
router.post('/', authMiddleware, adminOnly, categoryController.createCategory);

module.exports = router;