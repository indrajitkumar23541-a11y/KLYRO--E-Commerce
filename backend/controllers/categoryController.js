const { pool } = require('../config/db');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json({ success: true, count: categories.length, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const { name, parent_id } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' });
        }
        const [result] = await pool.query('INSERT INTO categories (name, parent_id) VALUES (?, ?)', [name, parent_id || null]);
        res.status(201).json({ success: true, message: 'Category created', categoryId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        res.json({ success: true, message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory
};
