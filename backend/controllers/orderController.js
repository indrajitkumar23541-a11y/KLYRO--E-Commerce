const { pool } = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ success: false, message: 'No order items' });
        }

        // 1. Create Order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_price, shipping_address, payment_method) VALUES (?, ?, ?, ?)',
            [req.user.id, totalPrice, JSON.stringify(shippingAddress), paymentMethod]
        );
        const orderId = orderResult.insertId;

        // 2. Create Order Items
        for (const item of orderItems) {
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.product, item.quantity, item.price]
            );
        }

        // 3. Clear Cart
        const [carts] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
        if (carts.length > 0) {
            await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
            await connection.query('UPDATE cart SET total_price = 0 WHERE id = ?', [carts[0].id]);
        }

        await connection.commit();
        res.status(201).json({ success: true, orderId });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.name, u.email 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             WHERE o.id = ?`, 
            [req.params.id]
        );

        if (orders.length > 0) {
            const order = orders[0];
            const [items] = await pool.query(
                `SELECT oi.*, p.name, p.image 
                 FROM order_items oi 
                 JOIN products p ON oi.product_id = p.id 
                 WHERE oi.order_id = ?`, 
                [order.id]
            );
            res.json({ success: true, order: { ...order, orderItems: items } });
        } else {
            res.status(404).json({ success: false, message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(
            `SELECT o.*, u.name as user_name 
             FROM orders o 
             JOIN users u ON o.user_id = u.id 
             ORDER BY o.created_at DESC`
        );
        res.json({ success: true, count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const [result] = await pool.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }
        res.json({ success: true, message: 'Order status updated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
};
