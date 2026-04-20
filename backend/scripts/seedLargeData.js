const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const categories = [
    'Smartphones', 'Laptops', 'Wearables', 'Audio', 'Gaming',
    'Mens Fashion', 'Womens Fashion', 'Footwear', 'Watches', 'Jewelry',
    'Home Decor', 'Furniture', 'Kitchen Appliances', 'Smart Home', 'Bedding',
    'Skincare', 'Makeup', 'Haircare', 'Fragrance', 'Grooming',
    'Fitness', 'Outdoor Gear', 'Cycling', 'Indoor Sports', 'Yoga',
    'Books', 'Art Supplies', 'Musical Instruments', 'Pet Supplies', 'Office Tech'
];

const generateProductName = (category, index) => {
    const prefixes = ['Premium', 'Luxury', 'Essential', 'Pro', 'Ultra', 'Modern', 'Classic', 'Elite', 'NextGen', 'Supreme'];
    const suffixes = ['X1', 'V2', 'Edition', 'Plus', 'Max', 'Prime', 'Gold', 'Stealth', 'Alpha', 'Omega'];
    const p = prefixes[index % 10];
    const s = suffixes[Math.floor(index / 10) % 10];
    const base = category.slice(0, -1); // Remove 's' if plural
    return `${p} ${base} ${s} #${index + 1}`;
};

const seedData = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log('🌱 Starting Bulk Seeding (3000 Products)...');

        // 1. Insert Categories
        const [catResult] = await connection.query(
            'INSERT INTO categories (name) VALUES ?',
            [categories.map(c => [c])]
        );
        console.log(`✅ ${categories.length} Categories Inserted.`);

        // 2. Fetch Category IDs
        const [catRows] = await connection.query('SELECT id, name FROM categories');
        const catMap = catRows.map(c => ({ id: c.id, name: c.name }));

        // 3. Generate Products (100 per category)
        const products = [];
        for (const cat of catMap) {
            for (let i = 0; i < 100; i++) {
                const name = generateProductName(cat.name, i);
                const price = Math.floor(Math.random() * (99999 - 199 + 1) + 199);
                const queryTag = cat.name.split(' ').join(',').toLowerCase();
                const image = `https://images.unsplash.com/photo-1?auto=format&fit=crop&w=500&q=80&sig=${cat.id}-${i}&keywords=${queryTag}`; // Using sig for unique images
                // Note: Unsplash Source API is deprecated, using sig/params on base unsplash photos or just a better placeholder
                const realImage = `https://source.unsplash.com/featured/500x500?${queryTag}&sig=${cat.id}-${i}`;
                // Fallback for source.unsplash if failing (using direct unsplash collection search pattern)
                const fallbackImage = `https://images.unsplash.com/photo-${1500000000000 + (cat.id * 100) + i}?auto=format&fit=crop&w=500&q=80&sig=${cat.id}-${i}`;
                
                // Using a more reliable pattern: random search redirects
                const finalImage = `https://loremflickr.com/500/500/${queryTag.split(',')[0]}?lock=${cat.id * 100 + i}`;

                products.push([
                    name,
                    price,
                    cat.id,
                    finalImage,
                    `Premium ${name} designed for ultimate performance and style. Part of our exclusive ${cat.name} collection.`
                ]);
            }
        }

        // 4. Bulk Insert Products
        await connection.query(
            'INSERT INTO products (name, price, category_id, image, description) VALUES ?',
            [products]
        );

        console.log(`🚀 Successfully Seeded ${products.length} Products!`);
        await connection.end();
    } catch (error) {
        console.error('❌ Seeding Failed:', error.message);
        await connection.end();
        process.exit(1);
    }
};

seedData();
