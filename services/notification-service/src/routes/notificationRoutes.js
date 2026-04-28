const express = require('express');
const router = express.Router();
const { sendNotification, getMyNotifications, markAsRead } = require('../controllers/notificationController');

// User Alerts
router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);

// Dispatch (Usually called by other services)
router.post('/send', sendNotification);

module.exports = router;
