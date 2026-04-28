const { pool } = require('../../../shared/config/db');

// ─── CATEGORIES ───────────────────────────────────────────────

// @desc    Get all categories (public)
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT id, name, parent_id FROM categories ORDER BY name ASC');
        res.json({ success: true, categories });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── PRODUCTS ─────────────────────────────────────────────────

// @desc    Get products (public, with filtering)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { limit, sort, category_id, search } = req.query;

        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE 1=1
        `;
        const params = [];

        // Filter by category (include subcategories)
        if (category_id) {
            query += ` AND (p.category_id = ? OR p.category_id IN (SELECT id FROM categories WHERE parent_id = ?))`;
            params.push(category_id, category_id);
        }

        // Search filter
        if (search) {
            query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        // Sorting
        if (sort === 'popular') {
            query += ` ORDER BY p.created_at DESC`;
        } else if (sort === 'newest') {
            query += ` ORDER BY p.created_at DESC`;
        } else if (sort === 'price_low') {
            query += ` ORDER BY p.price ASC`;
        } else if (sort === 'price_high') {
            query += ` ORDER BY p.price DESC`;
        } else {
            query += ` ORDER BY p.created_at DESC`;
        }

        // Limit
        if (limit) {
            query += ` LIMIT ?`;
            params.push(parseInt(limit));
        }

        const [products] = await pool.query(query, params);
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Fetch product images
        const [images] = await pool.query('SELECT * FROM product_images WHERE product_id = ?', [req.params.id]);

        // Fetch reviews
        const [reviews] = await pool.query(`
            SELECT r.*, u.name as user_name, u.avatar as user_avatar
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.product_id = ?
            ORDER BY r.created_at DESC
        `, [req.params.id]);

        const product = products[0];
        product.images = images;
        product.reviews = reviews;

        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── CART ─────────────────────────────────────────────────────

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get or create cart
        let [carts] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
            return res.json({ success: true, cart: { items: [] } });
        }

        const cartId = carts[0].id;
        const [items] = await pool.query(`
            SELECT ci.id, ci.product_id, ci.quantity, ci.price, 
                   p.name, p.image, p.stock_quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        `, [cartId]);

        res.json({ success: true, cart: { items } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;

        // Get product price
        const [products] = await pool.query('SELECT id, price, discount_price FROM products WHERE id = ?', [productId]);
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const product = products[0];
        const price = product.discount_price || product.price;

        // Get or create cart
        let [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
        let cartId;
        if (carts.length === 0) {
            const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [userId]);
            cartId = result.insertId;
        } else {
            cartId = carts[0].id;
        }

        // Check if item already in cart
        const [existing] = await pool.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [cartId, productId]
        );

        if (existing.length > 0) {
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [quantity, existing[0].id]
            );
        } else {
            await pool.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [cartId, productId, quantity, price]
            );
        }

        res.json({ success: true, message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;
        const { quantity } = req.body;

        const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        await pool.query(
            'UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?',
            [quantity, carts[0].id, productId]
        );

        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const productId = req.params.productId;

        const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            return res.status(404).json({ success: false, message: 'Cart not found' });
        }

        await pool.query(
            'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',
            [carts[0].id, productId]
        );

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ─── ORDERS ───────────────────────────────────────────────────

// @desc    Place an order (checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shipping_address, payment_method } = req.body;

        // Get cart items
        const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
        if (carts.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const cartId = carts[0].id;
        const [items] = await pool.query(
            'SELECT ci.*, p.name FROM cart_items ci JOIN products p ON ci.product_id = p.id WHERE ci.cart_id = ?',
            [cartId]
        );

        if (items.length === 0) {
            return res.status(400).json({ success: false, message: 'Cart is empty' });
        }

        const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Create order
        const [orderResult] = await pool.query(
            'INSERT INTO orders (user_id, total_price, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
            [userId, totalPrice, shipping_address || 'N/A', payment_method || 'COD']
        );

        const orderId = orderResult.insertId;

        // Create order items
        const orderItems = items.map(item => [orderId, item.product_id, item.quantity, item.price]);
        await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [orderItems]);

        // Clear cart
        await pool.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

        res.status(201).json({ success: true, message: 'Order placed successfully', orderId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        for (let order of orders) {
            const [items] = await pool.query(`
                SELECT oi.*, p.name, p.image
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ?
            `, [order.id]);
            order.items = items;
        }

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCategories,
    getProducts,
    getProductById,
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    createOrder,
    getUserOrders
};
