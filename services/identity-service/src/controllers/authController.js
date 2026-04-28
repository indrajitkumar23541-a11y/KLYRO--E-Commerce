const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        if (result.insertId) {
            res.status(201).json({
                success: true,
                _id: result.insertId,
                name: name,
                email: email,
                role: 'user',
                token: generateToken(result.insertId)
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (users.length > 0) {
            const user = users[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                res.json({
                    success: true,
                    _id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user.id)
                });
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        } else {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id as _id, name, email, role FROM users WHERE id = ?', [req.user.id]);

        if (users.length > 0) {
            res.json({
                success: true,
                ...users[0]
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;
        const [result] = await pool.query(
            'UPDATE users SET name = ?, email = ? WHERE id = ?',
            [name, email, req.user.id]
        );

        if (result.affectedRows > 0) {
            res.json({
                success: true,
                message: 'Profile updated successfully',
                user: { id: req.user.id, name, email, role: req.user.role }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
const updateUserPassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, users[0].password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password' });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Register as a seller
// @route   POST /api/auth/register-seller
// @access  Public
const registerSeller = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { name, email, password, storeName, storeDescription, phone, address } = req.body;

        let userId;
        let isExistingUser = false;

        // Check if user already exists
        const [existingUsers] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (existingUsers.length > 0) {
            userId = existingUsers[0].id;
            isExistingUser = true;
            // If user is already a seller or admin, don't allow re-registration
            if (existingUsers[0].role !== 'user') {
                return res.status(400).json({ success: false, message: 'This account is already registered as a ' + existingUsers[0].role });
            }
        } else {
            // Create new user
            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(password, salt);
            const [userResult] = await connection.query(
                'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                [name, email, hashedPassword]
            );
            userId = userResult.insertId;
        }

        // Check auto-approve setting
        const [settings] = await connection.query("SELECT setting_value FROM settings WHERE setting_key = 'auto_approve_sellers'");
        const autoApprove = settings.length > 0 ? settings[0].setting_value === 'true' : false;
        const status = autoApprove ? 'approved' : 'pending';

        // Check if seller profile already exists
        const [existingProfiles] = await connection.query('SELECT * FROM seller_profiles WHERE user_id = ?', [userId]);
        if (existingProfiles.length > 0) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Seller application already submitted for this account' });
        }

        // Create seller profile
        await connection.query(
            'INSERT INTO seller_profiles (user_id, store_name, store_description, phone, address, status) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, storeName, storeDescription, phone, address, status]
        );

        // Update user role if approved
        if (autoApprove) {
            await connection.query('UPDATE users SET role = ? WHERE id = ?', ['seller', userId]);
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: autoApprove ? 'Seller account approved and ready!' : 'Seller application submitted for review.',
            autoApproved: autoApprove,
            user: {
                id: userId,
                name,
                email,
                role: autoApprove ? 'seller' : 'user',
                token: generateToken(userId)
            }
        });

    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

// @desc    Update profile image (Avatar)
// @route   PUT /api/auth/avatar
// @access  Private
const updateAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload an image' });
        }

        const avatarUrl = `/uploads/${req.file.filename}`;
        await pool.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, req.user.id]);

        res.json({
            success: true,
            message: 'Avatar updated successfully',
            avatar: avatarUrl
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    registerSeller,
    updateAvatar
};
