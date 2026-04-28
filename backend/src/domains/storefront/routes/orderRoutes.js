const express = require('express');
const router = express.Router();
const { createOrder, getUserOrders } = require('../controllers/storefrontController');
const { protect } = require('../../../shared/middleware/authMiddleware');

// Orders (mounted at /api/orders)
router.post('/', protect, createOrder);
router.get('/', protect, getUserOrders);

module.exports = router;
