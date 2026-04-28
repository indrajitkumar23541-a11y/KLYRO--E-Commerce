const { pool } = require('../config/db');

// @desc    Get logged in user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const [carts] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [req.user.id]);
        
        let cart;
        let cartItems = [];

        if (carts.length > 0) {
            cart = carts[0];
            const [items] = await pool.query(
                `SELECT ci.*, p.name, p.image, p.price as current_price 
                 FROM cart_items ci 
                 JOIN products p ON ci.product_id = p.id 
                 WHERE ci.cart_id = ?`, 
                [cart.id]
            );

            cartItems = items.map(item => ({
                id: item.id,
                cart_id: item.cart_id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.current_price, // Use current_price from JOIN
                product: {
                    id: item.product_id,
                    name: item.name,
                    image: item.image,
                    price: item.current_price
                }
            }));
        } else {
            // Create empty cart if not exists
            const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
            cart = { id: result.insertId, user_id: req.user.id, total_price: 0 };
        }

        res.json({ success: true, cart: { ...cart, items: cartItems } });
    } catch (error) {
        console.error("getCart API Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        
        // 1. Check if product exists
        const [products] = await pool.query('SELECT price FROM products WHERE id = ?', [productId]);
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }
        const productPrice = products[0].price;

        // 2. Get or Create Cart
        let [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
        let cartId;
        if (carts.length === 0) {
            const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
            cartId = result.insertId;
        } else {
            cartId = carts[0].id;
        }

        // 3. Check if item already in cart
        const [existingItems] = await pool.query(
            'SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', 
            [cartId, productId]
        );

        if (existingItems.length > 0) {
            // Update quantity
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
                [Number(quantity), existingItems[0].id]
            );
        } else {
            // Add new item
            await pool.query(
                'INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [cartId, productId, Number(quantity), productPrice]
            );
        }

        // 4. Update total price
        const [items] = await pool.query('SELECT quantity, price FROM cart_items WHERE cart_id = ?', [cartId]);
        const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        await pool.query('UPDATE cart SET total_price = ? WHERE id = ?', [totalPrice, cartId]);

        res.json({ success: true, message: 'Item added to cart' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
        if (carts.length === 0) return res.status(404).json({ success: false, message: 'Cart not found' });
        
        const cartId = carts[0].id;
        await pool.query('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, req.params.id]);

        // Update total price
        const [items] = await pool.query('SELECT quantity, price FROM cart_items WHERE cart_id = ?', [cartId]);
        const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        await pool.query('UPDATE cart SET total_price = ? WHERE id = ?', [totalPrice, cartId]);

        res.json({ success: true, message: 'Item removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        const [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
        if (carts.length === 0) return res.status(404).json({ success: false, message: 'Cart not found' });
        
        const cartId = carts[0].id;
        await pool.query('UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?', [Number(quantity), cartId, req.params.id]);

        // Update total price
        const [items] = await pool.query('SELECT quantity, price FROM cart_items WHERE cart_id = ?', [cartId]);
        const totalPrice = items.reduce((acc, item) => acc + item.quantity * item.price, 0);
        await pool.query('UPDATE cart SET total_price = ? WHERE id = ?', [totalPrice, cartId]);

        res.json({ success: true, message: 'Quantity updated' });
    } catch (error) {
        console.error("Cart API Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    updateCartItem
};
