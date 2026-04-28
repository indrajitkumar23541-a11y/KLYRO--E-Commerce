const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/storefrontController');
const { protect } = require('../../../shared/middleware/authMiddleware');

// Cart (mounted at /api/cart)
router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/:productId', protect, updateCartItem);
router.delete('/:productId', protect, removeCartItem);

module.exports = router;
