require('dotenv').config({ path: './backend/.env' });
const { pool } = require('../config/db');


async function updateSuitImage() {
    try {
        const [result] = await pool.query(
            "UPDATE products SET image = ? WHERE name LIKE ?",
            ['/images/armani_suit.png', '%Armani Tailored Two-Piece Wool Suit%']
        );

        if (result.affectedRows > 0) {
            console.log('✅ Successfully updated Armani suit image.');
        } else {
            console.log('❌ Product not found or no changes made.');
        }
    } catch (error) {
        console.error('❌ Error updating product:', error);
    } finally {
        process.exit();
    }
}

updateSuitImage();
