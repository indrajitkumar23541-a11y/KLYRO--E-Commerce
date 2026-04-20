const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const images = {
    'WOW Onion Hair Oil': 'https://images.unsplash.com/photo-1631730432741-e79dd5e46597?auto=format&fit=crop&w=800&q=80',
    'Lakmé 9to5 Primer Matte': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    'Lakme 9to5 Primer Matte': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    'L\'Oréal Professional Scalp Expert': 'https://images.unsplash.com/photo-1527799820374-d888a96c76a5?auto=format&fit=crop&w=800&q=80',
    'L\'Oreal Professional Scalp Expert': 'https://images.unsplash.com/photo-1527799820374-d888a96c76a5?auto=format&fit=crop&w=800&q=80'
};

const updateImages = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🔄 Finalizing Image Fix for WOW, Lakme, and L\'Oreal...');

        for (const [name, url] of Object.entries(images)) {
            const [result] = await connection.query(
                'UPDATE products SET image = ? WHERE name LIKE ?',
                [url, `%${name}%`]
            );
            console.log(`✅ Updated ${name}: ${result.affectedRows} rows affected.`);
        }

        await connection.end();
        console.log('🚀 Final Image Fix Complete!');
    } catch (error) {
        console.error('❌ Update failed:', error.message);
    }
};

updateImages();
