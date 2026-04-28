const express = require('express');
const router = express.Router();
const { getProducts, getProductById } = require('../controllers/storefrontController');

// Products (mounted at /api/products)
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
