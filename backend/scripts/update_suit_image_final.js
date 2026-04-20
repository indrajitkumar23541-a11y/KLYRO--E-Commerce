const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function updateSuitImage() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        const [result] = await connection.execute(
            "UPDATE products SET image = ? WHERE name = 'Armani Tailored Two-Piece Wool Suit'",
            ['/images/armani_suit.png']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Successfully updated Armani suit image.');
        } else {
            console.log('❌ Product not found or no changes made.');
        }
    } catch (error) {
        console.error('❌ Error updating product:', error.message);
    } finally {
        await connection.end();
    }
}

updateSuitImage();
