const express = require('express');
const router = express.Router();
const { getAdminStats, getAllUsers, deleteUser, updateUserRole, getSalesAnalytics } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getAdminStats);
router.get('/analytics', protect, admin, getSalesAnalytics);

router.route('/users')
    .get(protect, admin, getAllUsers);

router.route('/users/:id')
    .delete(protect, admin, deleteUser)
    .put(protect, admin, updateUserRole);

module.exports = router;
