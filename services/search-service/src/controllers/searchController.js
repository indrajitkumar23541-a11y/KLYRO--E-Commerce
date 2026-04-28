const { pool } = require('../config/db');

// @desc    Global Search across products
// @route   GET /api/search
// @access  Public
const searchProducts = async (req, res) => {
    try {
        const { q, category_id, minPrice, maxPrice, sort } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE 1=1
        `;
        let countQuery = 'SELECT COUNT(*) as total FROM products p WHERE 1=1';
        let params = [];

        // Keyword Search
        if (q) {
            const searchPattern = `%${q}%`;
            query += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            countQuery += ' AND (p.name LIKE ? OR p.description LIKE ?)';
            params.push(searchPattern, searchPattern);
        }

        // Category Filter
        if (category_id && category_id !== 'all') {
            query += ' AND (p.category_id = ? OR p.category_id IN (SELECT id FROM categories WHERE parent_id = ?))';
            countQuery += ' AND (p.category_id = ? OR p.category_id IN (SELECT id FROM categories WHERE parent_id = ?))';
            params.push(category_id, category_id);
        }

        // Price Filter
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

        // Sorting
        let orderBy = 'p.created_at DESC';
        if (sort === 'popular') {
            orderBy = '(p.views_count * 1 + p.search_count * 2) DESC';
        } else if (sort === 'price_low') {
            orderBy = 'p.price ASC';
        } else if (sort === 'price_high') {
            orderBy = 'p.price DESC';
        } else if (sort === 'rating') {
            orderBy = 'p.rating DESC';
        }

        query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
        
        // Execute queries
        const [countResult] = await pool.query(countQuery, params);
        const total = countResult[0].total;
        
        const finalParams = [...params, limit, offset];
        const [products] = await pool.query(query, finalParams);

        // Track Search Analytics (Background)
        if (q && products.length > 0) {
            const ids = products.slice(0, 5).map(p => p.id);
            pool.query('UPDATE products SET search_count = search_count + 1 WHERE id IN (?)', [ids]).catch(e => console.error('Analytics Error:', e));
        }

        res.json({
            success: true,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            count: products.length,
            products
        });

    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ success: false, message: 'Internal Search Error' });
    }
};

module.exports = { searchProducts };
