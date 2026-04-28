const express = require('express');
const router = express.Router();
const { searchProducts } = require('../controllers/searchController');

// Global Product Search
router.get('/', searchProducts);

module.exports = router;
