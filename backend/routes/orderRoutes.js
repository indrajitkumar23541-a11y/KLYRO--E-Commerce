const express = require('express');
const router = express.Router();
const { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
