const { pool } = require('../config/db');

// @desc    Get seller dashboard statistics
// @route   GET /api/seller/stats
// @access  Private/Seller
const getSellerStats = async (req, res) => {
    try {
        const sellerId = req.user.id;

        const queries = [
            pool.query('SELECT COUNT(*) as count FROM products WHERE seller_id = ?', [sellerId]),
            pool.query(`
                SELECT COUNT(DISTINCT o.id) as count 
                FROM orders o
                JOIN order_items oi ON o.id = oi.order_id
                JOIN products p ON oi.product_id = p.id
                WHERE p.seller_id = ?
            `, [sellerId]),
            pool.query(`
                SELECT SUM(oi.price * oi.quantity) as sum 
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                JOIN orders o ON oi.order_id = o.id
                WHERE p.seller_id = ? AND o.status != 'cancelled'
            `, [sellerId])
        ];

        const results = await Promise.all(queries);

        const stats = {
            totalProducts: results[0][0][0].count || 0,
            totalOrders: results[1][0][0].count || 0,
            totalRevenue: results[2][0][0].sum || 0
        };

        res.json({ success: true, stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all products for a seller
// @route   GET /api/seller/products
// @access  Private/Seller
const getSellerProducts = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const [products] = await pool.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.seller_id = ? 
            ORDER BY p.created_at DESC
        `, [sellerId]);
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders for a seller's products
// @route   GET /api/seller/orders
// @access  Private/Seller
const getSellerOrders = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const [orders] = await pool.query(`
            SELECT DISTINCT o.*, u.name as buyer_name, u.email as buyer_email
            FROM orders o
            JOIN users u ON o.user_id = u.id
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.seller_id = ?
            ORDER BY o.created_at DESC
        `, [sellerId]);

        // Get items for each order that belong to this seller
        for (let order of orders) {
            const [items] = await pool.query(`
                SELECT oi.*, p.name, p.image
                FROM order_items oi
                JOIN products p ON oi.product_id = p.id
                WHERE oi.order_id = ? AND p.seller_id = ?
            `, [order.id, sellerId]);
            order.items = items;
        }

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get seller sales analytics
// @route   GET /api/seller/analytics
// @access  Private/Seller
const getSellerAnalytics = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const [rows] = await pool.query(`
            SELECT 
                DATE_FORMAT(o.created_at, '%Y-%m-%d') as date,
                COUNT(DISTINCT o.id) as orders,
                CAST(SUM(oi.price * oi.quantity) AS DECIMAL(10,2)) as revenue
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.seller_id = ? AND o.status != 'cancelled'
            GROUP BY DATE(o.created_at)
            ORDER BY date ASC
            LIMIT 30
        `, [sellerId]);

        res.json({ success: true, analytics: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a product for a seller
// @route   POST /api/seller/products
// @access  Private/Seller
const createSellerProduct = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { name, price, category_id, description, sku, stock_quantity, discount_price } = req.body;
        
        if (!name || !price) {
             return res.status(400).json({ success: false, message: 'Name and price are required' });
        }

        // Get uploaded file paths
        const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
        const mainImage = images[0] || '';

        // Generate SKU if not provided
        const finalSku = sku || `SKU-${Date.now()}`;

        const [result] = await pool.query(
            'INSERT INTO products (name, price, discount_price, stock_quantity, category_id, seller_id, sku, image, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, price, discount_price || null, stock_quantity || 0, category_id || null, sellerId, finalSku, mainImage, description || '']
        );

        const productId = result.insertId;

        // Save multiple images to product_images table
        if (images.length > 0) {
            const imageValues = images.map((url, index) => [productId, url, index === 0]);
            await pool.query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?', [imageValues]);
        }

        res.status(201).json({ success: true, message: 'Product created successfully', productId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a seller product
// @route   PUT /api/seller/products/:id
// @access  Private/Seller
const updateSellerProduct = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const productId = req.params.id;
        const { name, price, discount_price, stock_quantity, category_id, description, sku, existingImages } = req.body;

        // Check ownership
        const [existing] = await pool.query('SELECT seller_id FROM products WHERE id = ?', [productId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (existing[0].seller_id !== sellerId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not own this product' });
        }

        // Process new uploads
        const newImages = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
        
        // Parse existing images if they come as string
        let keptImages = [];
        if (existingImages) {
            keptImages = Array.isArray(existingImages) ? existingImages : [existingImages];
        }

        const allImages = [...keptImages, ...newImages];
        const mainImage = allImages[0] || '';

        await pool.query(
            'UPDATE products SET name = ?, price = ?, discount_price = ?, stock_quantity = ?, category_id = ?, image = ?, description = ?, sku = ? WHERE id = ?',
            [name, price, discount_price || null, stock_quantity || 0, category_id || null, mainImage, description || '', sku || '', productId]
        );

        // Sync product_images table
        await pool.query('DELETE FROM product_images WHERE product_id = ?', [productId]);
        if (allImages.length > 0) {
            const imageValues = allImages.map((url, index) => [productId, url, index === 0]);
            await pool.query('INSERT INTO product_images (product_id, image_url, is_primary) VALUES ?', [imageValues]);
        }

        res.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a seller product
// @route   DELETE /api/seller/products/:id
// @access  Private/Seller
const deleteSellerProduct = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const productId = req.params.id;

        // Check ownership
        const [existing] = await pool.query('SELECT seller_id FROM products WHERE id = ?', [productId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        if (existing[0].seller_id !== sellerId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not own this product' });
        }

        await pool.query('DELETE FROM products WHERE id = ?', [productId]);
        res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get seller profile settings
// @route   GET /api/seller/profile
// @access  Private/Seller
const getSellerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const [profiles] = await pool.query(`
            SELECT u.name, u.email, u.avatar, sp.store_name, sp.store_description, sp.phone, sp.address, sp.status,
                   sp.email_notifications, sp.order_notifications, sp.marketing_notifications
            FROM users u
            LEFT JOIN seller_profiles sp ON u.id = sp.user_id
            WHERE u.id = ?
        `, [userId]);

        if (profiles.length === 0) {
            return res.status(404).json({ success: false, message: 'Seller profile not found' });
        }

        res.json({ success: true, profile: profiles[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update seller profile info (Store Identity)
// @route   PUT /api/seller/profile
// @access  Private/Seller
const updateSellerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, storeName, storeDescription, phone, address } = req.body;

        // Update user name
        if (name) {
            await pool.query('UPDATE users SET name = ? WHERE id = ?', [name, userId]);
        }

        // Update or insert seller profile
        const [existing] = await pool.query('SELECT id FROM seller_profiles WHERE user_id = ?', [userId]);
        
        if (existing.length > 0) {
            await pool.query(`
                UPDATE seller_profiles 
                SET store_name = ?, store_description = ?, phone = ?, address = ?
                WHERE user_id = ?
            `, [storeName, storeDescription, phone, address, userId]);
        } else {
            await pool.query(`
                INSERT INTO seller_profiles (user_id, store_name, store_description, phone, address)
                VALUES (?, ?, ?, ?, ?)
            `, [userId, storeName, storeDescription, phone, address]);
        }

        res.json({ success: true, message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update notification preferences
// @route   PUT /api/seller/notifications
// @access  Private/Seller
const updateSellerNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { email_notifications, order_notifications, marketing_notifications } = req.body;

        await pool.query(`
            UPDATE seller_profiles 
            SET email_notifications = ?, order_notifications = ?, marketing_notifications = ?
            WHERE user_id = ?
        `, [email_notifications, order_notifications, marketing_notifications, userId]);

        res.json({ success: true, message: 'Notification preferences updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update status of an order containing seller products
// @route   PUT /api/seller/orders/:id/status
// @access  Private/Seller
const updateSellerOrderStatus = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const orderId = req.params.id;
        const { status } = req.body;

        // Verify if order contains seller's products
        const [items] = await pool.query(`
            SELECT oi.id 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ? AND p.seller_id = ?
        `, [orderId, sellerId]);

        if (items.length === 0) {
            return res.status(403).json({ success: false, message: 'Forbidden: Order does not contain your products' });
        }

        // Update global order status and tracking info
        const { tracking_id, carrier } = req.body;
        
        let updateQuery = 'UPDATE orders SET status = ?';
        let queryParams = [status];
        
        if (tracking_id !== undefined) {
            updateQuery += ', tracking_id = ?';
            queryParams.push(tracking_id);
        }
        if (carrier !== undefined) {
            updateQuery += ', carrier = ?';
            queryParams.push(carrier);
        }
        
        updateQuery += ' WHERE id = ?';
        queryParams.push(orderId);

        await pool.query(updateQuery, queryParams);

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get customers who have ordered from this seller
// @route   GET /api/seller/customers
// @access  Private/Seller
const getSellerCustomers = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const [customers] = await pool.query(`
            SELECT DISTINCT 
                u.id, u.name, u.email, u.avatar,
                COUNT(DISTINCT o.id) as total_orders,
                SUM(oi.price * oi.quantity) as total_spend,
                MAX(o.created_at) as last_order_date
            FROM users u
            JOIN orders o ON u.id = o.user_id
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.seller_id = ?
            GROUP BY u.id
            ORDER BY total_spend DESC
        `, [sellerId]);

        res.json({ success: true, customers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all reviews for seller's products
// @route   GET /api/seller/reviews
// @access  Private/Seller
const getSellerReviews = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const [reviews] = await pool.query(`
            SELECT r.*, p.name as product_name, p.image as product_image, u.name as user_name, u.avatar as user_avatar
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            JOIN users u ON r.user_id = u.id
            WHERE p.seller_id = ?
            ORDER BY r.created_at DESC
        `, [sellerId]);

        res.json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Reply to a review
// @route   PUT /api/seller/reviews/:id/reply
// @access  Private/Seller
const replyToReview = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const reviewId = req.params.id;
        const { reply } = req.body;

        // Verify that the review is for a product owned by the seller
        const [review] = await pool.query(`
            SELECT r.id 
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            WHERE r.id = ? AND p.seller_id = ?
        `, [reviewId, sellerId]);

        if (review.length === 0) {
            return res.status(403).json({ success: false, message: 'Forbidden: You do not own this product' });
        }

        await pool.query('UPDATE reviews SET seller_reply = ? WHERE id = ?', [reply, reviewId]);

        res.json({ success: true, message: 'Reply posted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all coupons for a seller
// @route   GET /api/seller/coupons
// @access  Private/Seller
const getSellerCoupons = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const [coupons] = await pool.query('SELECT * FROM coupons WHERE seller_id = ? ORDER BY created_at DESC', [sellerId]);
        res.json({ success: true, coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a coupon
// @route   POST /api/seller/coupons
// @access  Private/Seller
const createSellerCoupon = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { code, discount_type, discount_value, min_purchase, max_discount, expiry_date, usage_limit } = req.body;

        await pool.query(
            'INSERT INTO coupons (code, discount_type, discount_value, min_purchase, max_discount, expiry_date, seller_id, usage_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [code, discount_type, discount_value, min_purchase || 0, max_discount || null, expiry_date, sellerId, usage_limit || null]
        );

        res.status(201).json({ success: true, message: 'Coupon created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a coupon
// @route   PUT /api/seller/coupons/:id
// @access  Private/Seller
const updateSellerCoupon = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const couponId = req.params.id;
        const { is_active, expiry_date, usage_limit } = req.body;

        await pool.query(
            'UPDATE coupons SET is_active = ?, expiry_date = ?, usage_limit = ? WHERE id = ? AND seller_id = ?',
            [is_active, expiry_date, usage_limit, couponId, sellerId]
        );

        res.json({ success: true, message: 'Coupon updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a coupon
// @route   DELETE /api/seller/coupons/:id
// @access  Private/Seller
const deleteSellerCoupon = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const couponId = req.params.id;

        await pool.query('DELETE FROM coupons WHERE id = ? AND seller_id = ?', [couponId, sellerId]);
        res.json({ success: true, message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get payments/earnings for a seller
// @route   GET /api/seller/payments
// @access  Private/Seller
const getSellerPayments = async (req, res) => {
    try {
        const sellerId = req.user.id;

        // Fetch transaction history
        const [transactions] = await pool.query(`
            SELECT 
                o.id as order_id, 
                o.created_at as date,
                o.total_price as amount,
                o.status,
                o.payment_method
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            WHERE p.seller_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [sellerId]);

        // Calculate summary
        const [summary] = await pool.query(`
            SELECT 
                SUM(oi.price * oi.quantity) as gross_earnings,
                COUNT(DISTINCT o.id) as total_sales
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            JOIN orders o ON oi.order_id = o.id
            WHERE p.seller_id = ? AND o.status != 'cancelled'
        `, [sellerId]);

        res.json({ 
            success: true, 
            transactions,
            summary: {
                gross_earnings: summary[0].gross_earnings || 0,
                total_sales: summary[0].total_sales || 0,
                commission_rate: 0.1, // 10% mock commission
                net_earnings: (summary[0].gross_earnings || 0) * 0.9
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSellerStats,
    getSellerProducts,
    getSellerOrders,
    getSellerAnalytics,
    createSellerProduct,
    updateSellerProduct,
    deleteSellerProduct,
    updateSellerOrderStatus,
    getSellerProfile,
    updateSellerProfile,
    updateSellerNotifications,
    getSellerCustomers,
    getSellerReviews,
    replyToReview,
    getSellerCoupons,
    createSellerCoupon,
    updateSellerCoupon,
    deleteSellerCoupon,
    getSellerPayments
};
