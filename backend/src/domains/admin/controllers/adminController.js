const { pool } = require('../../../shared/config/db');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const queries = [
            pool.query('SELECT COUNT(*) as count FROM users'),
            pool.query('SELECT COUNT(*) as count FROM orders'),
            pool.query('SELECT COUNT(*) as count FROM products'),
            pool.query("SELECT SUM(total_price) as sum FROM orders WHERE status != 'cancelled'")
        ];

        const results = await Promise.all(queries);

        const stats = {
            totalUsers: results[0][0][0].count || 0,
            totalOrders: results[1][0][0].count || 0,
            totalProducts: results[2][0][0].count || 0,
            totalRevenue: results[3][0][0].sum || 0
        };

        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin', 'seller'].includes(role)) {
            return res.status(400).json({ success: false, message: 'Invalid role' });
        }
        const [result] = await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get sales analytics (time-series)
// @route   GET /api/admin/analytics
// @access  Private/Admin
const getSalesAnalytics = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                DATE_FORMAT(created_at, '%Y-%m-%d') as date,
                COUNT(*) as orders,
                CAST(SUM(total_price) AS DECIMAL(10,2)) as revenue
            FROM orders
            WHERE status != 'cancelled'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
            LIMIT 30
        `);

        res.json({ success: true, analytics: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getAdminSettings = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT setting_key, setting_value FROM settings');
        const settings = {};
        rows.forEach(row => {
            let val = row.setting_value;
            if (val === 'true') val = true;
            if (val === 'false') val = false;
            settings[row.setting_key] = val;
        });
        res.json({ success: true, settings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update platform settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateAdminSettings = async (req, res) => {
    try {
        const settings = req.body; // { key1: val1, key2: val2 }
        
        for (const [key, value] of Object.entries(settings)) {
            await pool.query(
                'INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
                [key, String(value), String(value)]
            );
        }

        res.json({ success: true, message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    deleteUser,
    updateUserRole,
    getSalesAnalytics,
    getAdminSettings,
    updateAdminSettings
};
