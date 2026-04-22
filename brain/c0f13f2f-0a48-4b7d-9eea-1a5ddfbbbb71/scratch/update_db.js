require('dotenv').config({ path: 'e:/KLYRO/backend/.env' });
const { pool } = require('e:/KLYRO/backend/config/db');

const updateDB = async () => {
    try {
        console.log('🔄 Starting DB Update...');
        
        // 1. Create reviews table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                rating INT NOT NULL,
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Created reviews table');

        // 2. Add return columns to orders
        // Note: Using a safe approach to add columns if they don't exist
        const [columns] = await pool.query('SHOW COLUMNS FROM orders LIKE "return_status"');
        if (columns.length === 0) {
            await pool.query(`
                ALTER TABLE orders 
                ADD COLUMN return_status ENUM('none', 'pending', 'approved', 'rejected') DEFAULT 'none',
                ADD COLUMN return_reason TEXT
            `);
            console.log('✅ Added return columns to orders');
        } else {
            console.log('ℹ️ Return columns already exist');
        }

        console.log('🎉 DB Update Successful');
        process.exit(0);
    } catch (error) {
        console.error('❌ DB Update Failed:', error);
        process.exit(1);
    }
};

updateDB();
