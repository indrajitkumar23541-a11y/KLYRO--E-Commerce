const mysql = require('mysql2/promise');
const run = async () => {
    const c = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_product_db'
    });
    const [sub92] = await c.query('SELECT name FROM categories WHERE parent_id = 92');
    const [sub38] = await c.query('SELECT name FROM categories WHERE parent_id = 38');
    console.log('ID 92 (Grocery) Subs:', sub92.map(x => x.name).join(', '));
    console.log('ID 38 (Grocery & Essentials) Subs:', sub38.map(x => x.name).join(', '));
    await c.end();
};
run();
