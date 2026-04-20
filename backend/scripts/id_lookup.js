const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const checkNames = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query(
            "SELECT id, name, image FROM products WHERE name LIKE '%WOW%' OR name LIKE '%Oreal%' OR name LIKE '%Lakme%' OR name LIKE '%9to5%'"
        );
        console.log('📦 Exact Products in Database:');
        rows.forEach(r => console.log(`- [${r.id}] ${r.name} | IMG: ${r.image}`));
        
        await connection.end();
    } catch (error) {
        console.error('❌ DB Check failed:', error.message);
    }
};

checkNames();
