const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Adding seller_id column to products table...');
        await connection.query(`
            ALTER TABLE products 
            ADD COLUMN seller_id INT DEFAULT 1,
            ADD CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
        `);
        console.log('✅ Migration successful!');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('❌ Migration failed:', error.message);
        }
    } finally {
        await connection.end();
    }
}

migrate();
