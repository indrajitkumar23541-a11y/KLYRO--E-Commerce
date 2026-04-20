const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function restoreCategories() {
    let connection;
    try {
        console.log('📂 Reading cats.json...');
        const catsPath = path.join(__dirname, '../cats.json');
        const catsData = JSON.parse(await fs.readFile(catsPath, 'utf8'));

        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('🔄 Cleaning existing categories...');
        // Disable FK checks to allow clearing and inserting with specific IDs
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('TRUNCATE TABLE categories');

        console.log(`🌱 Inserting ${catsData.length} categories...`);
        
        // Split into parent and children to ensure parent exists first (though we are using SET FOREIGN_KEY_CHECKS = 0)
        // Using a simple loop is safer for preserving original IDs
        for (const cat of catsData) {
            await connection.query(
                'INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?)',
                [cat.id, cat.name, cat.parent_id]
            );
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
        console.log('✅ Categories restored successfully!');

    } catch (error) {
        console.error('❌ Restoration failed:', error.message);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}

restoreCategories();
