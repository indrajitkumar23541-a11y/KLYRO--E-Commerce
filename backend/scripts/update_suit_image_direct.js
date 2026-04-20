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
            console.log('✅ Updated Armani suit image.');
        } else {
            // Let's see if we can find any Armani suit
            const [rows] = await connection.execute("SELECT id, name FROM products WHERE name LIKE '%Armani%'");
            if (rows.length > 0) {
                const targetName = rows[0].name;
                await connection.execute("UPDATE products SET image = ? WHERE name = ?", ['/images/armani_suit.png', targetName]);
                console.log(`✅ Updated "${targetName}" image.`);
            } else {
                console.log('❌ No Armani suit found.');
            }
        }
    } catch (error) {
        console.error('❌ Error updating product:', error.message);
    } finally {
        await connection.end();
        process.exit(0);
    }
}

updateSuitImage();
