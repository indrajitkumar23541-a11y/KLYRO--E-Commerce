const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'E:/KLYRO/backend/.env' });

async function checkTables() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query('SHOW TABLES');
        console.log('Tables in klyro_db:', rows);
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}
checkTables();
