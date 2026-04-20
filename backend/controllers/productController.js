const { pool } = require('../config/db');

// @desc    Fetch all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { category_id, minPrice, maxPrice, search } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
        let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE 1=1';
        let params = [];

        if (category_id && category_id !== 'all') {
            query += ' AND (p.category_id = ? OR p.category_id IN (SELECT id FROM categories WHERE parent_id = ?))';
            countQuery += ' AND (p.category_id = ? OR p.category_id IN (SELECT id FROM categories WHERE parent_id = ?))';
            params.push(category_id, category_id);
        }
        if (minPrice) {
            query += ' AND p.price >= ?';
            countQuery += ' AND p.price >= ?';
            params.push(minPrice);
        }
        if (maxPrice) {
            query += ' AND p.price <= ?';
            countQuery += ' AND p.price <= ?';
            params.push(maxPrice);
        }
        if (search) {
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam);
        }

        // Get total count for pagination
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limit);

        // Sorting logic
        let orderBy = 'p.created_at DESC';
        if (req.query.sort === 'popular') {
            orderBy = '(p.views_count * 1 + p.search_count * 2) DESC';
        }

        // Add pagination to query
        query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
        const finalParams = [...params, limit, offset];

        const [products] = await pool.query(query, finalParams);

        res.json({ 
            success: true, 
            total,
            totalPages,
            currentPage: page,
            count: products.length, 
            products 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.name as category_name, c.parent_id as parent_category_id, pc.name as parent_category_name
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            LEFT JOIN categories pc ON c.parent_id = pc.id
            WHERE p.id = ?
        `;
        const [products] = await pool.query(query, [req.params.id]);

        if (products.length > 0) {
            // Track view (Background update)
            pool.query('UPDATE products SET views_count = views_count + 1 WHERE id = ?', [req.params.id]).catch(err => console.error('View tracking error:', err));
            
            res.json({ success: true, product: products[0] });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search products by name
// @route   GET /api/products/search
// @access  Public
const searchProducts = async (req, res) => {
    try {
        const q = req.query.q || '';
        const searchParam = `%${q}%`;
        const [products] = await pool.query('SELECT * FROM products WHERE name LIKE ?', [searchParam]);
        
        // Track searches for found products
        if (products.length > 0) {
            const productIds = products.map(p => p.id);
            pool.query('UPDATE products SET search_count = search_count + 1 WHERE id IN (?)', [productIds]).catch(err => console.error('Search tracking error:', err));
        }

        res.json({ success: true, count: products.length, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, price, category_id, image, description } = req.body;
        
        if (!name || !price) {
             return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        const [result] = await pool.query(
            'INSERT INTO products (name, price, category_id, image, description) VALUES (?, ?, ?, ?, ?)',
            [name, price, category_id || null, image || '', description || '']
        );

        res.status(201).json({ success: true, message: 'Product created', productId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, price, category_id, image, description } = req.body;

        const [result] = await pool.query(
            'UPDATE products SET name = ?, price = ?, category_id = ?, image = ?, description = ? WHERE id = ?',
            [name, price, category_id || null, image || '', description || '', req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    searchProducts,
    createProduct,
    updateProduct,
    deleteProduct
};
