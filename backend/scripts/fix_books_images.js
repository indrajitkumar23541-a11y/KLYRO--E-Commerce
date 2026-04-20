const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const fixBooksImages = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🖼️ Updating book images with verified URLs...');

        const updates = [
            { name: "Rich Dad Poor Dad", image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg" },
            { name: "Quantitative Aptitude for Competitive Examinations", image: "https://rukminim2.flixcart.com/image/612/612/xif0q/book/2/8/x/quantitative-aptitude-for-competitive-examinations-original-imahefewzj5rhmup.jpeg?q=70" },
            { name: "As A Man Thinketh", image: "https://m.media-amazon.com/images/I/71iPHi7hISL.jpg" },
            { name: "Spoken English for Beginners", image: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1623991908i/57825551.jpg" }
        ];

        for (const update of updates) {
            await connection.query('UPDATE products SET image = ? WHERE name = ?', [update.image, update.name]);
            console.log(`✅ Updated image for: ${update.name}`);
        }

        await connection.end();
        console.log('🚀 Book images updated successfully!');
    } catch (error) {
        console.error('❌ Failed:', error.message);
    }
};

fixBooksImages();
