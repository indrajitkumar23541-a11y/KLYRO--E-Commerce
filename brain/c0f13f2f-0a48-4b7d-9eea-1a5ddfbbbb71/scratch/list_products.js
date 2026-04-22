require('dotenv').config({ path: 'e:/KLYRO/backend/.env' });
const { pool } = require('e:/KLYRO/backend/config/db');

const getProducts = async () => {
    try {
        const [rows] = await pool.query('SELECT id, name, seller_id FROM products');
        console.log('--- PRODUCTS LIST ---');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

getProducts();
