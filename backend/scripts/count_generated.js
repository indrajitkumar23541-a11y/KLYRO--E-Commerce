const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkNames = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query(
            "SELECT COUNT(*) as count FROM products WHERE description LIKE 'Premium % formulated for effective results. %'"
        );
        console.log(`📦 Found ${rows[0].count} generated products.`);
        
        await connection.end();
    } catch (error) {
        console.error('❌ DB Check failed:', error.message);
    }
};

checkNames();
