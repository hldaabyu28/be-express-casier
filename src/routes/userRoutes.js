const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

router.get('/', authMiddleware, adminOnly, userController.getAllUsers);
router.delete('/:id', authMiddleware, adminOnly, userController.deleteUser);

module.exports = router;