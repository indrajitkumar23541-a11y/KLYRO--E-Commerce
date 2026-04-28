const mysql = require('mysql2/promise');
const run = async () => {
    const c = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_product_db'
    });
    const [sub92] = await c.query('SELECT * FROM categories WHERE parent_id = 92');
    const [sub38] = await c.query('SELECT * FROM categories WHERE parent_id = 38');
    console.log('ID 92 Subs:', sub92.length);
    console.log('ID 38 Subs:', sub38.length);
    await c.end();
};
run();
