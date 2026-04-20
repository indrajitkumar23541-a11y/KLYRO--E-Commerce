const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const products = [
    { name: "CeraVe Hydrating Cleanser", price: 1299, image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80" },
    { name: "Minimalist 10% Vitamin C", price: 699, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80" },
    { name: "The Derma Co 2% Salicylic", price: 499, image: "https://images.unsplash.com/photo-1594465919760-441fe5908ab0?auto=format&fit=crop&w=800&q=80" },
    { name: "La Roche-Posay Effaclar", price: 1850, image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=800&q=80" },
    { name: "Paula's Choice BHA Exfoliant", price: 2700, image: "https://images.unsplash.com/photo-1570191048235-96144e5ea70d?auto=format&fit=crop&w=800&q=80" }
];

const brands = ["CeraVe", "Minimalist", "The Ordinary", "Derma Co", "Cetaphil", "Neutrogena", "La Roche-Posay", "Dr. Sheth's", "Biotique", "Dot & Key"];
const types = ["Face Wash", "Face Serum", "Moisturizer", "Sunscreen", "Night Cream", "Face Mask", "Toner", "Eye Cream", "Cleansing Balm", "Sheet Mask"];
const ingredients = ["Vitamin C", "Hyaluronic Acid", "Retinol", "Salicylic Acid", "Niacinamide", "Rice Water", "Tea Tree", "Alpha Arbutin", "Centella", "Green Tea"];

const generateProducts = () => {
    const data = [];
    for (let i = 0; i < 100; i++) {
        const brand = brands[Math.floor(Math.random() * brands.length)];
        const type = types[Math.floor(Math.random() * types.length)];
        const ingredient = ingredients[Math.floor(Math.random() * ingredients.length)];
        const name = `${brand} ${ingredient} ${type}`;
        const price = Math.floor(Math.random() * (2500 - 299 + 1) + 299);
        
        // Dynamic Unsplash Keyword Search for Variety
        const keyword = type.toLowerCase().replace(' ', ',');
        const image = `https://loremflickr.com/800/800/skincare,bottle,${keyword}?lock=${i + 500}`;
        
        data.push([
            name,
            price,
            22, // Skincare Category ID
            image,
            `Premium ${name} formulated for effective results. Dermatologically tested and suitable for all skin types. Paraben-free and cruelty-free.`
        ]);
    }
    return data;
};

const seedSkincare = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🌱 Starting Bulk Seeding: 100 Skincare Products...');

        const skincareData = generateProducts();

        await connection.query(
            'INSERT INTO products (name, price, category_id, image, description) VALUES ?',
            [skincareData]
        );

        console.log(`🚀 Successfully Seeded ${skincareData.length} Skincare Products!`);
        await connection.end();
    } catch (error) {
        console.error('❌ Seeding Failed:', error.message);
    }
};

seedSkincare();
