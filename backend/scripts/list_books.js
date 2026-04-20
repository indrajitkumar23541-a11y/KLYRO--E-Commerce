const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const listBooks = async () => {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [rows] = await connection.query("SELECT id FROM categories WHERE name = 'Books & Education'");
        if (rows.length === 0) {
            fs.writeFileSync('books_debug.txt', '❌ Books & Education category not found.');
            return;
        }
        const rootId = rows[0].id;

        const [products] = await connection.query(`
            SELECT p.id, p.name, p.image, c.name as category_name 
            FROM products p 
            JOIN categories c ON p.category_id = c.id 
            WHERE c.parent_id = ? OR c.id = ?
        `, [rootId, rootId]);
        
        let out = `📚 Found ${products.length} books in Database:\n`;
        products.forEach(p => {
            out += `- [${p.id}] ${p.name} (${p.category_name}) -> Image: ${p.image}\n`;
        });
        fs.writeFileSync('books_debug.txt', out);
        console.log('Done.');

    } catch (error) {
        fs.writeFileSync('books_debug.txt', '❌ Failed: ' + error.message);
    } finally {
        if (connection) await connection.end();
    }
};

listBooks();
