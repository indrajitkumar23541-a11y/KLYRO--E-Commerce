const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function checkCats() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM categories');
        console.log('Category Count:', rows[0].count);
        
        const [cats] = await connection.execute('SELECT * FROM categories');
        console.log('Categories:', JSON.stringify(cats, null, 2));
        
        await connection.end();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkCats();
