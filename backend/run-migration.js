const { pool } = require('./config/db');
const fs = require('fs').promises;
const path = require('path');

async function runMigration() {
    try {
        console.log('🚀 Starting Database Migration...');
        const migrationPath = path.join(__dirname, 'migrations', 'expand_products.sql');
        const sql = await fs.readFile(migrationPath, 'utf8');
        
        // Execute multiple statements
        await pool.query(sql);
        
        console.log('✅ Migration successful: Products table expanded.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
