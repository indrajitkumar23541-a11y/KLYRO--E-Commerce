const mysql = require('mysql2/promise');
require('dotenv').config();

async function resetDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log('--- Starting Database Cleanup ---');
        
        const cleanupQuery = `
            SET FOREIGN_KEY_CHECKS = 0;
            DELETE FROM order_items;
            DELETE FROM orders;
            DELETE FROM cart_items;
            DELETE FROM cart;
            DELETE FROM products;
            DELETE FROM categories;
            ALTER TABLE products AUTO_INCREMENT = 1;
            ALTER TABLE categories AUTO_INCREMENT = 1;
            SET FOREIGN_KEY_CHECKS = 1;
        `;

        await connection.query(cleanupQuery);
        console.log('✅ All data cleared and IDs reset.');

        // Verification
        const [products] = await connection.query('SELECT COUNT(*) as count FROM products');
        const [categories] = await connection.query('SELECT COUNT(*) as count FROM categories');
        
        console.log('Counts:');
        console.log(`- Products: ${products[0].count}`);
        console.log(`- Categories: ${categories[0].count}`);

    } catch (error) {
        console.error('❌ Error during cleanup:', error.message);
    } finally {
        await connection.end();
    }
}

resetDB();
