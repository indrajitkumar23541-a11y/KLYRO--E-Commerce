const express = require('express');
const router = express.Router();
const { 
    getSellerStats, 
    getSellerProducts, 
    getSellerOrders,
    getSellerAnalytics,
    createSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    updateSellerOrderStatus,
    getSellerProfile,
    updateSellerProfile,
    updateSellerNotifications,
    getSellerCustomers,
    getSellerReviews,
    replyToReview,
    getSellerCoupons,
    createSellerCoupon,
    updateSellerCoupon,
    deleteSellerCoupon,
    getSellerPayments
} = require('../controllers/sellerController');
const { protect, seller } = require('../../../shared/middleware/authMiddleware');
const upload = require('../../../shared/middleware/uploadMiddleware');

router.use(protect);
router.use(seller);

router.get('/stats', getSellerStats);
router.get('/products', getSellerProducts);
router.post('/products', upload.array('images', 5), createSellerProduct);
router.put('/products/:id', upload.array('images', 5), updateSellerProduct);
router.delete('/products/:id', deleteSellerProduct);
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateSellerOrderStatus);
router.get('/analytics', getSellerAnalytics);
router.get('/customers', getSellerCustomers);
router.get('/reviews', getSellerReviews);
router.put('/reviews/:id/reply', replyToReview);
router.get('/coupons', getSellerCoupons);
router.post('/coupons', createSellerCoupon);
router.put('/coupons/:id', updateSellerCoupon);
router.delete('/coupons/:id', deleteSellerCoupon);
router.get('/payments', getSellerPayments);
router.get('/profile', getSellerProfile);
router.put('/profile', updateSellerProfile);
router.put('/notifications', updateSellerNotifications);

module.exports = router;
