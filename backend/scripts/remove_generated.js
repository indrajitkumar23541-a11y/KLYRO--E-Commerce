const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const removeGenerated = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [result] = await connection.query(
            "DELETE FROM products WHERE description LIKE 'Premium % formulated for effective results. %'"
        );
        console.log(`✅ Successfully removed ${result.affectedRows} generated products.`);
        
        await connection.end();
    } catch (error) {
        console.error('❌ DB removal failed:', error.message);
    }
};

removeGenerated();
