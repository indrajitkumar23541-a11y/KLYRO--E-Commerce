const express = require('express');
const router = express.Router();
const {
    getCategories,
    getProducts,
    getProductById,
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    createOrder,
    getUserOrders
} = require('../controllers/storefrontController');
const { protect } = require('../../../shared/middleware/authMiddleware');

// ─── Public Routes ────────────────────────────────────────────
// These are mounted under different prefixes in server.js

// Categories (mounted at /api/categories)
router.get('/', getCategories);

module.exports = router;
