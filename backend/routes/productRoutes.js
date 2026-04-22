const express = require('express');
const router = express.Router();
const { getProducts, getProductById, searchProducts, createProduct, updateProduct, deleteProduct, createProductReview } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, admin, createProduct);

router.get('/search', searchProducts);

router.route('/:id')
    .get(getProductById)
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);

router.post('/:id/reviews', protect, createProductReview);

module.exports = router;
