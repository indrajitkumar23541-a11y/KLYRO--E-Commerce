const mysql = require('mysql2/promise');

async function dumpCategories() {
    const connection = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_db'
    });

    const [rows] = await connection.query('SELECT id, name, parent_id FROM categories');
    console.log(JSON.stringify(rows, null, 2));
    await connection.end();
}

dumpCategories();
