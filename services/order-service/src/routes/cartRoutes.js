const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCart);
router.post('/add', protect, addToCart);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeFromCart);

module.exports = router;
