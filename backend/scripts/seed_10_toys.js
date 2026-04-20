const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const seedToys = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🌱 Seeding 10 Premium Learning Toys...');

        // Category ID for Learning Toys is 65 based on previous check
        const categoryId = 65;

        const toys = [
            { 
                name: "LEGO Classic Large Creative Brick Box", 
                price: 3499, 
                image: "https://m.media-amazon.com/images/I/81b2X0jBgwL.jpg", 
                desc: "Unleash open-ended creativity and imagination with this classic large creative brick box. Comes with 790 pieces in 33 different colors, perfect for builders of all ages." 
            },
            { 
                name: "Fisher-Price Rock-a-Stack", 
                price: 499, 
                image: "https://m.media-amazon.com/images/I/71Xm3z04N4L.jpg", 
                desc: "A classic musical and stacking toy with 5 colorful rings to grasp, shake, and stack. Helps develop hand-eye coordination and introduces the concept of relative size." 
            },
            { 
                name: "Magna-Tiles 32-Piece Clear Colors Set", 
                price: 4500, 
                image: "https://m.media-amazon.com/images/I/81UsqM7mZAL.jpg", 
                desc: "The original 3D magnetic building tiles that engage young minds by fusing together math, science, and creativity. Safe, durable, and built to last for years of play." 
            },
            { 
                name: "LeapFrog Learning Friends 100 Words Book", 
                price: 1999, 
                image: "https://m.media-amazon.com/images/I/81TzZq9R2QL.jpg", 
                desc: "Touch words on the interactive pages to play words, exciting sound effects, and fun facts. An excellent bilingual (English/Spanish) foundational learning tool for toddlers." 
            },
            { 
                name: "Melissa & Doug Wooden Pattern Blocks", 
                price: 1799, 
                image: "https://m.media-amazon.com/images/I/910J784vQzL.jpg", 
                desc: "A classic math manipulative and learning activity set. Features 120 wooden blocks in various shapes and colors to inspire creative design and spatial reasoning." 
            },
            { 
                name: "Smartivity Pump It Move It Hydraulic Crane", 
                price: 1049, 
                image: "https://m.media-amazon.com/images/I/71YvR0V9pGL.jpg", // placeholder, will replace if needed, wait, let's use a better one: https://m.media-amazon.com/images/I/81k39Y3aMvL.jpg
                desc: "A functional, DIY hydraulic crane STEM educational toy. Teaches children about hydraulic systems, rack and pinion mechanisms, and realistic engineering principles." 
            },
            { 
                name: "Skillmatics Brain Games Educational Activity", 
                price: 699, 
                image: "https://m.media-amazon.com/images/I/81mD+sU-C5L.jpg", 
                desc: "Highly engaging educational activity mats that build core skills through fun learning methodologies. Includes 6 double-sided mats and a dry erase marker." 
            },
            { 
                name: "Shifu Orboot Earth Interactive AR Globe", 
                price: 1999, 
                image: "https://m.media-amazon.com/images/I/71WwQJ0dxyL.jpg", 
                desc: "An award-winning augmented reality globe that transforms your tablet into a magical gateway. Travel the world and learn about cultures, monuments, and animals." 
            },
            { 
                name: "Rubik's Cube 3x3 Original", 
                price: 399, 
                image: "https://m.media-amazon.com/images/I/71lC57P5WGL.jpg", 
                desc: "The world's most famous puzzle! The original 3x3 Rubik's Cube is a highly addictive brain teaser that develops problem-solving skills and spatial awareness." 
            },
            { 
                name: "Einstein Box for Early Learning", 
                price: 899, 
                image: "https://m.media-amazon.com/images/I/81vNmbZ5v7L.jpg", 
                desc: "India's leading early learning box for kids. Packed with premium quality books and educational activities to develop logic, creativity, and linguistic skills." 
            }
        ];

        // Fixing the hydraulic crane image
        toys[5].image = "https://m.media-amazon.com/images/I/81k39Y3aMvL.jpg";

        for (const toy of toys) {
            const [existing] = await connection.query('SELECT id FROM products WHERE name = ?', [toy.name]);
            if (existing.length === 0) {
                await connection.query('INSERT INTO products (name, price, category_id, image, description) VALUES (?, ?, ?, ?, ?)', [toy.name, toy.price, categoryId, toy.image, toy.desc]);
                console.log(`✅ Seeded: ${toy.name}`);
            } else {
                await connection.query('UPDATE products SET price = ?, category_id = ?, image = ?, description = ? WHERE id = ?', [toy.price, categoryId, toy.image, toy.desc, existing[0].id]);
                console.log(`✅ Updated: ${toy.name}`);
            }
        }

        await connection.end();
        console.log('🚀 Learning Toys Seeding Complete!');
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
};

seedToys();
