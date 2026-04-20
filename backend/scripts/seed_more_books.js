const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedMoreBooks = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🌱 Seeding 5 more legendary Indian books...');

        const [novels] = await connection.query('SELECT id FROM categories WHERE name = "Novels"');
        if (novels.length === 0) {
            console.error('❌ Novels category not found!');
            await connection.end();
            return;
        }
        const novelId = novels[0].id;

        const books = [
            { 
                name: "Gitanjali", 
                price: 139, 
                category_id: novelId, 
                image: "https://m.media-amazon.com/images/I/61o1VadKlzL.jpg", 
                desc: "A collection of 103 poems by Rabindranath Tagore, which won him the Nobel Prize in Literature. A spiritual masterpiece exploring the relationship between the human and the divine." 
            },
            { 
                name: "Wings of Fire", 
                price: 190, 
                category_id: novelId, 
                image: "https://m.media-amazon.com/images/I/71FagWAKDQL.jpg", 
                desc: "The inspiring autobiography of A.P.J. Abdul Kalam, chronicling his rise from a modest background to leading India's space and missile programs and becoming the 11th President of India." 
            },
            { 
                name: "Godan", 
                price: 119, 
                category_id: novelId, 
                image: "https://m.media-amazon.com/images/I/71mhqH3h+ZL.jpg", 
                desc: "Munshi Premchand's greatest work, representing the socio-economic struggles of the Indian peasantry. A poignant tale of a peasant's desire to own a cow and the tragedy of rural debt." 
            },
            { 
                name: "Train to Pakistan", 
                price: 215, 
                category_id: novelId, 
                image: "https://m.media-amazon.com/images/I/915ojTuXD+L.jpg", 
                desc: "A gritty historical novel by Khushwant Singh set during the Partition of India in 1947. It captures the sudden violence and tragedy that tore apart a peaceful village." 
            },
            { 
                name: "Malgudi Days", 
                price: 220, 
                category_id: novelId, 
                image: "https://m.media-amazon.com/images/I/61EH8ZgZe9L.jpg", 
                desc: "R.K. Narayan's beloved collection of short stories set in the fictional South Indian town of Malgudi. A masterful portrayal of everyday life with all its quirks and simplicity." 
            }
        ];

        for (const book of books) {
            const [existing] = await connection.query('SELECT id FROM products WHERE name = ?', [book.name]);
            if (existing.length === 0) {
                await connection.query('INSERT INTO products (name, price, category_id, image, description) VALUES (?, ?, ?, ?, ?)', [book.name, book.price, book.category_id, book.image, book.desc]);
                console.log(`✅ Seeded: ${book.name}`);
            } else {
                await connection.query('UPDATE products SET price = ?, category_id = ?, image = ?, description = ? WHERE id = ?', [book.price, book.category_id, book.image, book.desc, exisiting[0].id]);
                console.log(`✅ Updated: ${book.name}`);
            }
        }

        await connection.end();
        console.log('🚀 Additional Books Seeding Complete!');
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
};

seedMoreBooks();
