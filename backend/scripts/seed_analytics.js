const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedAnalytics() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('--- Seeding Analytics Data (Last 30 Days) ---');

        // 1. Get a user and some products to associate with orders
        const [users] = await connection.execute("SELECT id FROM users LIMIT 1");
        const [products] = await connection.execute("SELECT id, price FROM products LIMIT 10");

        if (users.length === 0 || products.length === 0) {
            console.error('❌ Error: Need at least one user and one product to seed orders.');
            return;
        }

        const userId = users[0].id;

        // 2. Generate orders for the last 30 days
        console.log('📦 Generating mock orders...');
        for (let i = 0; i < 30; i++) {
            // Random number of orders per day (0 to 5)
            const numOrders = Math.floor(Math.random() * 6);
            
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().slice(0, 19).replace('T', ' ');

            for (let j = 0; j < numOrders; j++) {
                // Random product
                const product = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 3) + 1;
                const totalPrice = product.price * qty;
                
                const statuses = ['delivered', 'shipped', 'processing', 'pending'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];

                const [orderRes] = await connection.execute(
                    "INSERT INTO orders (user_id, total_price, shipping_address, payment_method, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                    [userId, totalPrice, '123 Ghost Street, Neo City', 'Credit Card', status, dateString]
                );

                const orderId = orderRes.insertId;

                // Add order items
                await connection.execute(
                    "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
                    [orderId, product.id, qty, product.price]
                );
            }
            if (numOrders > 0) console.log(`   ✅ Seeded ${numOrders} orders for ${dateString.slice(0, 10)}`);
        }

        console.log('✨ Analytics seeding complete.');

    } catch (error) {
        console.error('❌ Seeding error:', error.message);
    } finally {
        await connection.end();
    }
}

seedAnalytics();
