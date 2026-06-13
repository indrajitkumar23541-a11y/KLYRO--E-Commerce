const mysql = require('mysql2/promise');

async function dumpCategories() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'Indrajit@7061',
            database: 'klyro_db',
            port: 3307 // Docker maps 3307 to 3306
        });

        const [rows] = await connection.query('SELECT id, name, parent_id FROM categories');
        console.log(JSON.stringify(rows, null, 2));
        await connection.end();
    } catch (e) {
        console.error(e);
    }
}

dumpCategories();
