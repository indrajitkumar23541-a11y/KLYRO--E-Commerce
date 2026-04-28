const mysql = require('mysql2/promise');
const run = async () => {
    const c = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_product_db'
    });
    const [g92] = await c.query('SELECT COUNT(*) as count FROM products WHERE category_id = 92');
    const [g38] = await c.query('SELECT COUNT(*) as count FROM products WHERE category_id = 38');
    console.log('ID 92 (Grocery):', g92[0].count);
    console.log('ID 38 (Grocery & Essentials):', g38[0].count);
    await c.end();
};
run();
