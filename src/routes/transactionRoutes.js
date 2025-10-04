const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, transactionController.createTransaction);
router.get('/', authMiddleware, transactionController.getAllTransactions);
router.get('/:id', authMiddleware, transactionController.getTransactionById);

module.exports = router;