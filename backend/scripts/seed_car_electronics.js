const mysql = require('mysql2/promise');
require('dotenv').config();

const carElectronics = [
    {
        name: "Ultra-Wide 4K Dual Dashcam (Night Vision)",
        description: "Front & Rear 4K resolution with Sony Starvis sensor, 170 degree wide view, and loop recording. Essential for car safety and evidence.",
        price: 15999,
        discount_price: 11499,
        stock: 25,
        category_id: 47, // Using current Car Electronics ID
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600" 
    },
    {
        name: "9-inch Android 14 Multimedia Infotainment Player",
        description: "HD IPS Touchscreen, Wireless Apple CarPlay & Android Auto, 4GB RAM + 64GB ROM, DSP Sound Processor.",
        price: 24999,
        discount_price: 18999,
        stock: 12,
        category_id: 47,
        image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=600"
    },
    {
        name: "Wireless Reverse Parking Camera & Sensor Kit",
        description: "IP68 Waterproof HD camera with 4 parking sensors and digital LED distance display.",
        price: 6999,
        discount_price: 4499,
        stock: 30,
        category_id: 47,
        image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=600"
    },
    {
        name: "Bluetooth OBD-II Car Diagnostic Scanner",
        description: "Real-time engine performance monitoring and fault code clearing via Smartphone App.",
        price: 2999,
        discount_price: 1499,
        stock: 50,
        category_id: 47,
        image: "https://images.unsplash.com/photo-1486496146582-9ffcd0b2b2b7?auto=format&fit=crop&q=80&w=600"
    },
    {
        name: "Premium Component Car Speakers (400W Peak)",
        description: "Audiophile grade sound quality with external crossovers and silk dome tweeters.",
        price: 9999,
        discount_price: 6999,
        stock: 15,
        category_id: 47,
        image: "https://images.unsplash.com/photo-1614934986218-48bc6286781f?auto=format&fit=crop&q=80&w=600"
    }
];

(async () => {
    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Seeding Car Electronics into ID 47...');

        for (const prod of carElectronics) {
            await conn.execute(
                'INSERT INTO products (name, description, price, discount_price, stock, category_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [prod.name, prod.description, prod.price, prod.discount_price, prod.stock, prod.category_id, prod.image]
            );
        }

        console.log('Seeding completed successfully.');
        await conn.end();
    } catch (err) {
        console.error('Seeding failed:', err);
    }
})();
