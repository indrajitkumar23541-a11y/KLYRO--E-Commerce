const { pool } = require('../config/db');

async function migrate() {
    try {
        console.log('Starting migration to add tracking fields...');
        
        // Check for columns first
        const [columns] = await pool.query('SHOW COLUMNS FROM orders');
        const columnNames = columns.map(c => c.Field);
        
        if (!columnNames.includes('tracking_id')) {
            await pool.query('ALTER TABLE orders ADD COLUMN tracking_id VARCHAR(255) NULL');
            console.log('Added tracking_id');
        }
        
        if (!columnNames.includes('carrier')) {
            await pool.query('ALTER TABLE orders ADD COLUMN carrier VARCHAR(100) NULL');
            console.log('Added carrier');
        }
        
        if (!columnNames.includes('seller_notes')) {
            await pool.query('ALTER TABLE orders ADD COLUMN seller_notes TEXT NULL');
            console.log('Added seller_notes');
        }
        
        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
