require('dotenv').config({ path: 'e:/KLYRO/backend/.env' });
const { pool } = require('e:/KLYRO/backend/config/db');

const deleteDefaultProducts = async () => {
    try {
        console.log('🚮 Starting deletion of default products (seller_id = 1)...');
        
        // 1. Get count of products to be deleted for verification
        const [countResult] = await pool.query('SELECT COUNT(*) as count FROM products WHERE seller_id = 1');
        const count = countResult[0].count;
        
        if (count === 0) {
            console.log('ℹ️ No default products found.');
            process.exit(0);
        }

        // 2. Delete products. Cascading deletes should handle cart_items and order_items.
        await pool.query('DELETE FROM products WHERE seller_id = 1');
        
        console.log(`✅ Successfully deleted ${count} default products.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Deletion failed:', error);
        process.exit(1);
    }
};

deleteDefaultProducts();
