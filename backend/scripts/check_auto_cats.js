const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        const [categories] = await conn.execute('SELECT * FROM categories WHERE parent_id = 46 OR id = 46');
        console.log('Categories:', JSON.stringify(categories, null, 2));
        
        const [products] = await conn.execute('SELECT id, name, category_id FROM products LIMIT 50');
        console.log('Sample Products:', JSON.stringify(products, null, 2));
        
        await conn.end();
    } catch (err) {
        console.error(err);
    }
})();
