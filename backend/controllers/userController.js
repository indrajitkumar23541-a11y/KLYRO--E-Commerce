const { pool } = require('../config/db');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, count: users.length, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUsers
};
