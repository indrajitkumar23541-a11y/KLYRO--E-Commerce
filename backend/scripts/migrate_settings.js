const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log('--- Starting Settings Migration ---');

        // 1. Add avatar to users table
        console.log('Checking for avatar column in users...');
        const [usersCols] = await connection.query('SHOW COLUMNS FROM users LIKE "avatar"');
        if (usersCols.length === 0) {
            await connection.query('ALTER TABLE users ADD COLUMN avatar VARCHAR(500) DEFAULT NULL');
            console.log('✅ Added avatar column to users.');
        } else {
            console.log('Column avatar already exists in users.');
        }

        // 2. Ensure seller_profiles table exists
        console.log('Ensuring seller_profiles table existence...');
        await connection.query(`
            CREATE TABLE IF NOT EXISTS seller_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL UNIQUE,
                store_name VARCHAR(255),
                store_description TEXT,
                phone VARCHAR(20),
                address TEXT,
                status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
                email_notifications BOOLEAN DEFAULT TRUE,
                order_notifications BOOLEAN DEFAULT TRUE,
                marketing_notifications BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ seller_profiles table is ready.');

        // 3. Add notification columns if missing (in case table already existed without them)
        const [profileCols] = await connection.query('SHOW COLUMNS FROM seller_profiles LIKE "email_notifications"');
        if (profileCols.length === 0) {
            await connection.query(`
                ALTER TABLE seller_profiles 
                ADD COLUMN email_notifications BOOLEAN DEFAULT TRUE,
                ADD COLUMN order_notifications BOOLEAN DEFAULT TRUE,
                ADD COLUMN marketing_notifications BOOLEAN DEFAULT FALSE
            `);
            console.log('✅ Added notification columns to seller_profiles.');
        }

        console.log('--- Migration Completed Successfully ---');
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
    } finally {
        await connection.end();
    }
}

migrate();
