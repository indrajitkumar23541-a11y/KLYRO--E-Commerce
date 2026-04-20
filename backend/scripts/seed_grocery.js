const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedGrocery() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('--- Seeding Grocery & Essentials ---');

        // 1. Create Main Category
        const [catResult] = await connection.execute(
            "INSERT INTO categories (name, parent_id) VALUES ('Grocery & Essentials', NULL) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)"
        );
        const mainId = catResult.insertId;
        console.log(`✅ Main Category ID: ${mainId}`);

        // 2. Create Subcategories
        const subs = ['Fruits & Vegetables', 'Dairy & Eggs', 'Pantry Essentials', 'Beverages', 'Snacks & Sweets'];
        const subIds = {};
        for (const sub of subs) {
            const [subRes] = await connection.execute(
                "INSERT INTO categories (name, parent_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)",
                [sub, mainId]
            );
            subIds[sub] = subRes.insertId;
            console.log(`   └─ Sub: ${sub} (ID: ${subRes.insertId})`);
        }

        // 3. Seed Products
        const products = [
            // Fruits & Vegetables
            { name: 'Organic Red Tomatoes (Harvest Basket)', price: 350, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1590779033100-9f60705a6382?auto=format&fit=crop&q=80&w=600', description: 'Farm fresh and organic tomatoes from local gardens.' },
            { name: 'Fresh Cabbage & Greens', price: 180, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1592394933325-108297502164?auto=format&fit=crop&q=80&w=600', description: 'Crisp green cabbage, freshly picked for maximum nutrients.' },
            { name: 'Organic Bell Peppers Mix', price: 250, category: 'Fruits & Vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?auto=format&fit=crop&q=80&w=600', description: 'Vibrant and crunchy bell peppers in multiple colors.' },
            
            // Top Offers Section (Specific items from image)
            { name: 'Premium Basmati Rice', price: 899, category: 'Pantry Essentials', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=600', description: 'Long-grain aged Basmati rice for the perfect aroma.' },
            { name: 'Pure Sunflower Cooking Oil', price: 450, category: 'Pantry Essentials', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=600', description: 'Refined sunflower oil for healthy and tasty cooking.' },
            { name: 'Fresh Artisanal Bread', price: 120, category: 'Pantry Essentials', image: 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&q=80&w=600', description: 'Freshly baked bread with a golden crust.' },
            { name: 'Power Clean Detergent Powder', price: 299, category: 'Daily Use', image: 'https://images.unsplash.com/photo-1551446591-142875a901a1?auto=format&fit=crop&q=80&w=600', description: 'Advanced formula for deep cleaning your fabrics.' },

            // Beverages
            { name: 'Pure Apple & Fruit Juice', price: 350, category: 'Beverages', image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=600', description: '100% pure fruit juice with no added sugar.' },
            { name: 'Premium Tea Selection', price: 150, category: 'Beverages', image: 'https://images.unsplash.com/photo-1544787210-2211d7c31d10?auto=format&fit=crop&q=80&w=600', description: 'Hand-picked tea leaves for a refreshing break.' },

            // Snacks & Sweets
            { name: 'Tasty Potato Chips', price: 99, category: 'Snacks & Sweets', image: 'https://images.unsplash.com/photo-1566478431379-88029094770e?auto=format&fit=crop&q=80&w=600', description: 'Crunchy and salted classic potato snacks.' },
            { name: 'Premium Dark Chocolate', price: 250, category: 'Snacks & Sweets', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=600', description: 'Artisanal dark chocolate with 70% cocoa.' },

            // Daily Essentials (Daily Use)
            { name: 'Colgate Total Dental Care', price: 150, category: 'Daily Use', image: 'https://images.unsplash.com/photo-1559591937-e68fb833eb91?auto=format&fit=crop&q=80&w=600', description: 'Complete protection for your teeth and gums.' },
            { name: 'Soft White Bath Towels', price: 850, category: 'Daily Use', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=600', description: 'Highly absorbent 100% cotton towels.' }
        ];

        for (const p of products) {
            await connection.execute(
                "INSERT INTO products (name, price, category_id, image, description) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE price=VALUES(price), image=VALUES(image), description=VALUES(description)",
                [p.name, p.price, subIds[p.category], p.image, p.description]
            );
            console.log(`📦 Seeded: ${p.name}`);
        }

        console.log('✅ Seeding complete.');

    } catch (error) {
        console.error('❌ Seeding error:', error.message);
    } finally {
        await connection.end();
    }
}

seedGrocery();
