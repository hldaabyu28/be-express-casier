const express = require('express');
const router = express.Router();
const taxController = require('../controllers/taxController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, taxController.getAllTaxes);
router.get('/default', authMiddleware, taxController.getDefaultTax);
router.post('/', authMiddleware, adminOnly, taxController.createTax);
router.put('/:id', authMiddleware, adminOnly, taxController.updateTax);
router.delete('/:id', authMiddleware, adminOnly, taxController.deleteTax);

module.exports = router;