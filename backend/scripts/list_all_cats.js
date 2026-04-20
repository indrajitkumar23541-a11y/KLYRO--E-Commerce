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

        const [cats] = await conn.execute('SELECT id, name, parent_id FROM categories');
        console.log('All Categories:', JSON.stringify(cats, null, 2));

        await conn.end();
    } catch (err) {
        console.error(err);
    }
})();
