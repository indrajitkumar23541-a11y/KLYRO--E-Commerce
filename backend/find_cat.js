const mysql = require('mysql2/promise');
const run = async () => {
    const c = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_product_db'
    });
    const [t] = await c.query('SELECT * FROM categories');
    const g = t.filter(x => x.name.toLowerCase().includes("grocery"));
    console.log(JSON.stringify(g, null, 2));
    await c.end();
};
run();
