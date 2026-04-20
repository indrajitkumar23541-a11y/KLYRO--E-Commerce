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

module.exports = {
    registerUser,
    loginUser,
    getUserProfile
};
