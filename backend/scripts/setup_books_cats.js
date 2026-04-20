const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const setupCategories = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🔄 Checking Books & Education Category Structure...');

        // 1. Ensure "Books & Education" exists
        let [rows] = await connection.query('SELECT id FROM categories WHERE name = "Books & Education"');
        let parentId;
        if (rows.length === 0) {
            const [result] = await connection.query('INSERT INTO categories (name) VALUES ("Books & Education")');
            parentId = result.insertId;
            console.log('✅ Created root "Books & Education" category.');
        } else {
            parentId = rows[0].id;
        }

        // 2. Ensure sub-categories exist
        const subs = ["Academic", "Novels", "Stationery", "Study Material", "Learning Toys"];
        for (const sub of subs) {
            let [subRows] = await connection.query('SELECT id FROM categories WHERE name = ?', [sub]);
            if (subRows.length === 0) {
                await connection.query('INSERT INTO categories (name, parent_id) VALUES (?, ?)', [sub, parentId]);
                console.log(`✅ Created sub-category: ${sub}`);
            } else {
                // Update parent_id if it was missing or different
                await connection.query('UPDATE categories SET parent_id = ? WHERE id = ?', [parentId, subRows[0].id]);
            }
        }

        await connection.end();
        console.log('🚀 Books Category Setup Complete!');
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
    }
};

setupCategories();
