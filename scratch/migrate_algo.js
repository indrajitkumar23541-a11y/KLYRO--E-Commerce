const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function migrate() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('👷 Migrating Database...');
        
        // Add columns if they don't exist
        const [columns] = await connection.query('SHOW COLUMNS FROM products');
        const columnNames = columns.map(c => c.Field);

        if (!columnNames.includes('views_count')) {
            await connection.query('ALTER TABLE products ADD COLUMN views_count INT DEFAULT 0');
            console.log('✅ Added views_count');
        }

        if (!columnNames.includes('search_count')) {
            await connection.query('ALTER TABLE products ADD COLUMN search_count INT DEFAULT 0');
            console.log('✅ Added search_count');
        }

        console.log('🚀 Migration successful!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    }
}

migrate();
