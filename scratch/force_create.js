const mysql = require('mysql2/promise');
const fs = require('fs').promises;

async function forceCreateTables() {
    try {
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password: 'Indrajit@7061',
            database: 'klyro_db',
            multipleStatements: true
        });

        const schema = await fs.readFile('E:/KLYRO/services/order-service/schema.sql', 'utf8');
        await connection.query(schema);
        console.log('Tables forced created successfully');
        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}
forceCreateTables();
