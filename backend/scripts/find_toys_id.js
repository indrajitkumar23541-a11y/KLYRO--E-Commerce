const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const findId = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query("SELECT id FROM categories WHERE name = 'Learning Toys'");
        if (rows.length > 0) {
            console.log(`🆔 ID for Learning Toys: ${rows[0].id}`);
        } else {
            console.log('❌ Learning Toys category not found.');
        }
        await connection.end();
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
};

findId();
