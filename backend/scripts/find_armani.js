require('dotenv').config({ path: './backend/.env' });
const { pool } = require('../config/db');

async function findArmani() {
    try {
        const [rows] = await pool.query("SELECT id, name FROM products WHERE name LIKE '%Armani%'");
        console.log('Search Results:', JSON.stringify(rows, null, 2));
    } catch (error) {
        console.error('Error searching:', error);
    } finally {
        process.exit();
    }
}

findArmani();
