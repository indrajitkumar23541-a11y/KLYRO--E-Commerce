const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedFinalBooks = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🌱 Seeding specific 4 Books from reference image...');

        // 1. Get Category IDs
        const [novels] = await connection.query('SELECT id FROM categories WHERE name = "Novels"');
        const [academic] = await connection.query('SELECT id FROM categories WHERE name = "Academic"');
        const novelId = novels[0].id;
        const academicId = academic[0].id;

        const books = [
            { id: 901, name: "Rich Dad Poor Dad", price: 399, category_id: novelId, image: "https://m.media-amazon.com/images/I/81fJo9996-L.jpg", desc: "The #1 personal finance book of all time. Robert Kiyosaki shares his story of growing up with two dads — his real father and the father of his best friend." },
            { id: 902, name: "Quantitative Aptitude for Competitive Examinations", price: 599, category_id: academicId, image: "https://m.media-amazon.com/images/I/91-0mZ9645L.jpg", desc: "The most trusted guide for competitive exams like CAT, GMAT, UPSC, and Bank PO. By R.S. Aggarwal." },
            { id: 903, name: "As A Man Thinketh", price: 374, category_id: novelId, image: "https://m.media-amazon.com/images/I/81+X6n7m70L.jpg", desc: "James Allen's classic self-help book. A timeless inspiration for character and thought development." },
            { id: 904, name: "Spoken English for Beginners", price: 399, category_id: academicId, image: "https://m.media-amazon.com/images/I/71Yv3P0Z6fL.jpg", desc: "A comprehensive guide to mastering conversational English with ease. Perfect for students and professionals alike." }
        ];

        for (const book of books) {
            // Check if exists by name
            const [existing] = await connection.query('SELECT id FROM products WHERE name = ?', [book.name]);
            if (existing.length === 0) {
                await connection.query('INSERT INTO products (name, price, category_id, image, description) VALUES (?, ?, ?, ?, ?)', [book.name, book.price, book.category_id, book.image, book.desc]);
                console.log(`✅ Seeded: ${book.name}`);
            } else {
                await connection.query('UPDATE products SET price = ?, category_id = ?, image = ?, description = ? WHERE id = ?', [book.price, book.category_id, book.image, book.desc, existing[0].id]);
                console.log(`✅ Updated: ${book.name}`);
            }
        }

        await connection.end();
        console.log('🚀 Books Seeding Complete!');
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
};

seedFinalBooks();
