const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const images = {
    'CeraVe Hydrating Cleanser': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    'Minimalist 10% Vitamin C': 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    'WOW Onion Hair Oil': 'https://images.unsplash.com/photo-1631730432741-e79dd5e46597?auto=format&fit=crop&w=800&q=80',
    'L\'Oréal Professional Scalp Expert': 'https://images.unsplash.com/photo-1527799820374-d888a96c76a5?auto=format&fit=crop&w=800&q=80',
    'Himalaya Baby Lotion': 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80',
    'Lakmé Absolute Foundation': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
    'The Derma Co 2% Salicylic': 'https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&w=800&q=80'
};

const updateImages = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🔄 Updating product images to high-quality Unsplash URLs...');

        for (const [name, url] of Object.entries(images)) {
            const [result] = await connection.query(
                'UPDATE products SET image = ? WHERE name LIKE ?',
                [url, `%${name}%`]
            );
            console.log(`✅ Updated ${name}: ${result.affectedRows} rows affected.`);
        }

        // Also update any other generic beauty products with a fallback
        const [generic] = await connection.query(
            'UPDATE products SET image = "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=800&q=80" WHERE category_id BETWEEN 21 AND 65 AND (image LIKE "/assets/%" OR image IS NULL OR image = "")'
        );
        console.log(`✨ Generic updates: ${generic.affectedRows} rows affected.`);

        await connection.end();
        console.log('🚀 Image Fix Complete!');
    } catch (error) {
        console.error('❌ Update failed:', error.message);
    }
};

updateImages();
