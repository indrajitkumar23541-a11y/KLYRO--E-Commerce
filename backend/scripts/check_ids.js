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

        const [auto] = await conn.execute('SELECT id FROM categories WHERE name = "Automotive" LIMIT 1');
        if (auto.length === 0) {
            console.log('Automotive category not found!');
            await conn.end();
            return;
        }
        const autoId = auto[0].id;

        const [subs] = await conn.execute('SELECT id, name FROM categories WHERE parent_id = ?', [autoId]);
        console.log('Automotive (ID:', autoId + ') Subcategories:', JSON.stringify(subs, null, 2));

        await conn.end();
    } catch (err) {
        console.error(err);
    }
})();
