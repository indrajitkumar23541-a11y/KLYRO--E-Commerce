const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedSample() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log('--- Seeding Sample Data ---');

        // 1. Insert Categories
        const categories = ['Women', 'Men', 'Accessories', 'Shoes', 'Watches'];
        const categoryIds = {};

        for (const cat of categories) {
            const [result] = await connection.query('INSERT INTO categories (name) VALUES (?)', [cat]);
            categoryIds[cat] = result.insertId;
            console.log(`- Created Category: ${cat} (ID: ${result.insertId})`);
        }

        // 2. Insert Products
        const products = [
            { 
                name: 'Classic White Tee', 
                price: 25.00, 
                category: 'Women', 
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
                description: 'A comfortable classic white t-shirt for everyday wear.'
            },
            { 
                name: 'Denim Jacket', 
                price: 85.00, 
                category: 'Men', 
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
                description: 'Vintage style denim jacket with premium wash.'
            },
            { 
                name: 'Leather Messenger Bag', 
                price: 120.00, 
                category: 'Accessories', 
                image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
                description: 'Handcrafted genuine leather messenger bag.'
            },
            { 
                name: 'Canvas Sneakers', 
                price: 45.00, 
                category: 'Shoes', 
                image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
                description: 'Lightweight canvas sneakers for casual outings.'
            },
            { 
                name: 'Minimalist Gold Watch', 
                price: 150.00, 
                category: 'Watches', 
                image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=800&q=80',
                description: 'Elegant minimalist watch with Japanese movement.'
            },
            { 
                name: 'Floral Summer Dress', 
                price: 65.00, 
                category: 'Women', 
                image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&q=80',
                description: 'Light and airy floral dress perfect for summer.'
            },
            { 
                name: 'Slim Fit Chinos', 
                price: 55.00, 
                category: 'Men', 
                image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
                description: 'Perfectly tailored slim fit chinos in sandy beige.'
            }
        ];

        for (const p of products) {
            await connection.query(
                'INSERT INTO products (name, price, category_id, image, description) VALUES (?, ?, ?, ?, ?)',
                [p.name, p.price, categoryIds[p.category], p.image, p.description]
            );
            console.log(`- Created Product: ${p.name}`);
        }

        console.log('✅ Sample data seeded successfully.');
        console.log('Category IDs mapping:', categoryIds);

    } catch (error) {
        console.error('❌ Error during seeding:', error.message);
    } finally {
        await connection.end();
    }
}

seedSample();
