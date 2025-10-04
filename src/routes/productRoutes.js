const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', authMiddleware, productController.getAllProducts);
router.get('/:id', authMiddleware, productController.getProductById);
router.post('/', authMiddleware, adminOnly, upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware, adminOnly, upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, adminOnly, productController.deleteProduct);

module.exports = router;