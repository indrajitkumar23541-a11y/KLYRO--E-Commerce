const mysql = require('mysql2/promise');

async function listDatabases() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'Indrajit@7061',
            port: 3307
        });

        const [rows] = await connection.query('SHOW DATABASES');
        console.log(JSON.stringify(rows, null, 2));
        await connection.end();
    } catch (e) {
        console.error(e);
    }
}

listDatabases();
