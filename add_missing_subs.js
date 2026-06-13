const mysql = require('mysql2/promise');
require('dotenv').config({ path: './services/product-service/.env' });

async function fix() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 3307 // Docker port
    });

    try {
        const parents = {
            'Automotive': ['Tires & Wheels', 'Helmets', 'Spare Parts', 'Car Care'],
            'Grocery': ['Fruits', 'Vegetables', 'Dairy', 'Staples', 'Snacks'],
            'Kids & Baby': ['Toys', 'Baby Care', 'Clothing', 'Footwear']
        };

        for (const [parentName, children] of Object.entries(parents)) {
            const [rows] = await connection.query('SELECT id FROM categories WHERE name = ?', [parentName]);
            if (rows.length > 0) {
                const parentId = rows[0].id;
                console.log(`Adding children for ${parentName} (ID: ${parentId})`);
                for (const childName of children) {
                    await connection.query('INSERT INTO categories (name, parent_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE parent_id = ?', [childName, parentId, parentId]);
                    console.log(`  Added ${childName}`);
                }
            } else {
                console.log(`Parent ${parentName} not found!`);
            }
        }

        console.log('Done!');
    } catch (err) {
        console.error(err);
    } finally {
        await connection.end();
    }
}

fix();
