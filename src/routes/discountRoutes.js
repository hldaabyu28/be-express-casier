const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, discountController.getAllDiscounts);
router.get('/check/:code', authMiddleware, discountController.checkDiscountCode);
router.get('/:id', authMiddleware, discountController.getDiscountById);
router.post('/', authMiddleware, adminOnly, discountController.createDiscount);
router.put('/:id', authMiddleware, adminOnly, discountController.updateDiscount);
router.delete('/:id', authMiddleware, adminOnly, discountController.deleteDiscount);

module.exports = router;