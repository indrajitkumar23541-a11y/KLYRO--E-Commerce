const { pool } = require('../../../shared/config/db');

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

// @desc    Update user avatar (Profile Picture)
// @route   PUT /api/users/avatar
// @access  Private
const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const avatarPath = `/uploads/avatars/${req.file.filename}`;
        const userId = req.user.id;

        await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, userId]);

        res.json({ 
            success: true, 
            message: 'Avatar updated successfully', 
            avatar: avatarPath 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getUsers,
    updateAvatar
};
