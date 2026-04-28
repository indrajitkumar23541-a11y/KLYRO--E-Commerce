const { pool } = require('../config/db');

// @desc    Send a notification (Internal/External)
// @route   POST /api/notifications/send
const sendNotification = async (req, res) => {
    try {
        const { user_id, type, title, message } = req.body;

        if (!user_id || !type) {
            return res.status(400).json({ success: false, message: 'User ID and type are required' });
        }

        // 1. Store in DB (In-App Notification)
        const [result] = await pool.query(
            'INSERT INTO notifications (user_id, type, title, message) VALUES (?, ?, ?, ?)',
            [user_id, type, title || 'KLYRO Alert', message]
        );

        // 2. Simulate Email Dispatch
        if (type === 'email') {
            console.log(`📧 [MOCK EMAIL] To: User ${user_id} | Subject: ${title} | Content: ${message}`);
        }

        res.status(201).json({ 
            success: true, 
            message: 'Notification sent successfully',
            notificationId: result.insertId
        });

    } catch (error) {
        console.error('Notification Error:', error);
        res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
};

// @desc    Get user notifications
// @route   GET /api/notifications
const getMyNotifications = async (req, res) => {
    try {
        const userId = req.headers['x-user-id']; // Simplified for now
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID header required' });
        }

        const [rows] = await pool.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
            [userId]
        );

        res.json({ success: true, count: rows.length, notifications: rows });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
};

// @desc    Mark as read
// @route   PUT /api/notifications/:id/read
const markAsRead = async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET status = "read" WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update failed' });
    }
};

module.exports = { sendNotification, getMyNotifications, markAsRead };
