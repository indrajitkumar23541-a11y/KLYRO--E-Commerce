const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function clearData() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log('--- Cleaning Up Default Data ---');

        // Disable foreign key checks to allow truncation of tables with relations
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');

        const tablesToClear = [
            'order_items',
            'orders',
            'cart_items',
            'cart',
            'products',
            'categories'
        ];

        for (const table of tablesToClear) {
            await connection.query(`TRUNCATE TABLE ${table}`);
            console.log(`✅ Cleared table: ${table}`);
        }

        // Re-enable foreign key checks
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        console.log('✨ Cleanup complete. All default data removed.');

    } catch (error) {
        console.error('❌ Cleanup error:', error.message);
    } finally {
        await connection.end();
    }
}

clearData();
