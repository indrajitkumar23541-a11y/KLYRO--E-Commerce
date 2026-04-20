const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../.env' });

const brands = [
    { name: 'Noise', lines: ['ColorFit Pro 4', 'ColorFit Ultra', 'Luna Smart Ring', 'Buds VS104', 'Air Buds Pro', 'ColorFit Pulse 3', 'Fit Active', 'NoiseFit Halo', 'Aero Smart Audio', 'Verve Buds'], cats: [7, 7, 7, 6, 6, 7, 7, 7, 6, 6], basePrice: 1500, mult: 500, img: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=600' },
    { name: 'HP', lines: ['Pavilion 14', 'Envy x360', 'Spectre x360 14', 'Omen 16 Gaming', 'Victus 15', 'ChromeBook 14', 'Pavilion Aero', 'ProBook 440', 'ZBook Firefly', 'EliteBook 840'], cats: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], basePrice: 45000, mult: 20000, img: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=600' },
    { name: 'Samsung', lines: ['Galaxy S24 Ultra', 'Galaxy S23 FE', 'Galaxy Z Fold 5', 'Galaxy Tab S9', 'Galaxy A54 5G', 'Galaxy Watch 6', 'Galaxy M34', 'Galaxy Tab A9', 'Galaxy Buds 2 Pro', 'Galaxy Z Flip 5'], cats: [2, 2, 2, 4, 2, 7, 2, 4, 6, 2], basePrice: 20000, mult: 15000, img: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=600' },
    { name: 'Apple', lines: ['iPhone 15 Pro Max', 'iPhone 14 Plus', 'MacBook Pro M3', 'MacBook Air M2', 'iPad Pro 12.9', 'Apple Watch Ultra 2', 'AirPods Pro 2', 'iPad Air 5th Gen', 'Mac Mini M2', 'Apple Watch Series 9'], cats: [2, 2, 3, 3, 4, 7, 6, 4, 3, 7], basePrice: 50000, mult: 25000, img: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&q=80&w=600' },
    { name: 'JBL', lines: ['Flip 6 Portable', 'Charge 5 Bluetooth', 'Boombox 3', 'PartyBox 310', 'Wave Buds', 'Tune 760NC', 'Live Pro 2', 'Pulse 5', 'Go 3', 'Tour One M2'], cats: [5, 5, 5, 5, 6, 6, 6, 5, 5, 6], basePrice: 3000, mult: 3000, img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Sony', lines: ['WH-1000XM5', 'WF-1000XM5', 'PlayStation 5', 'SRS-XG300', 'Bravia Theatre Bar', 'ZV-E10 Camera', 'LinkBuds S', 'HT-A7000 Soundbar', 'DualSense Controller', 'INZONE H9 Headset'], cats: [6, 6, 5, 5, 5, 5, 6, 5, 6, 6], basePrice: 15000, mult: 10000, img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Dell', lines: ['XPS 15 OLED', 'XPS 13 Plus', 'Alienware m18', 'Inspiron 14 Plus', 'Latitude 7440', 'Vostro 3520', 'Alienware x16', 'Precision 3580', 'G15 Gaming', 'Inspiron 16 2-in-1'], cats: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], basePrice: 40000, mult: 25000, img: 'https://images.unsplash.com/photo-1593642702821-c8f659df5d8b?auto=format&fit=crop&q=80&w=600' },
    { name: 'OnePlus', lines: ['OnePlus 12 5G', 'OnePlus 11R', 'Nord CE 4', 'OnePlus Pad', 'Buds Pro 2', 'Nord Buds 2', 'OnePlus Open', 'Watch 2', 'Nord CE 3 Lite', 'Bullets Wireless Z2'], cats: [2, 2, 2, 4, 6, 6, 2, 7, 2, 6], basePrice: 15000, mult: 8000, img: 'https://images.unsplash.com/photo-1621330396173-e41b1cafd17f?auto=format&fit=crop&q=80&w=600' },
    { name: 'Vivo', lines: ['X100 Pro 5G', 'V30 Pro', 'Y200e 5G', 'T2 Pro 5G', 'X90', 'V29', 'Y27', 'T2x', 'V29e', 'Y16'], cats: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2], basePrice: 12000, mult: 7000, img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=600' },
    { name: 'Oppo', lines: ['Find N3 Flip', 'Reno 11 Pro', 'F25 Pro 5G', 'A79 5G', 'Reno 10', 'Enco Air 3 Pro', 'A59 5G', 'F23 5G', 'Find X6 Pro', 'A18'], cats: [2, 2, 2, 2, 2, 6, 2, 2, 2, 2], basePrice: 11000, mult: 8000, img: 'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Xiaomi', lines: ['Xiaomi 14 Ultra', 'Redmi Note 13 Pro', 'Xiaomi Pad 6', 'Redmi 13C', 'Redmi Note 12', 'Redmi Watch 3 Active', 'Xiaomi 13 Pro', 'Redmi Buds 4', 'Xiaomi Smart TV X', 'Redmi Pad SE'], cats: [2, 2, 4, 2, 2, 7, 2, 6, 5, 4], basePrice: 10000, mult: 7000, img: 'https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&q=80&w=600' },
    { name: 'Acer', lines: ['Swift Go 14', 'Predator Helios Neo', 'Nitro V Gaming', 'Aspire 5', 'Aspire Lite', 'Predator Triton', 'Spin 5', 'ConceptD 3', 'Chromebook Plus', 'Extensa 15'], cats: [3, 3, 3, 3, 3, 3, 3, 3, 3, 3], basePrice: 35000, mult: 15000, img: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=600' },
    { name: 'Huawei', lines: ['P60 Pro', 'Mate 60 Pro', 'Watch GT 4', 'MatePad Pro 13', 'FreeBuds Pro 3', 'Nova 11', 'Watch Ultimate', 'MateBook X Pro', 'Band 8', 'Mate X3 Fold'], cats: [2, 2, 7, 4, 6, 2, 7, 3, 7, 2], basePrice: 13000, mult: 9000, img: 'https://images.unsplash.com/photo-1601784551446-20c9e07cd8d3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Fire-Boltt', lines: ['Ninja Call Pro', 'Gladiator Smartwatch', 'Visionary AMOLED', 'Phoenix Pro', 'Invincible Plus', 'Dream Wristphone', 'Cobra Rugged', 'Quantum Luxury', 'Asteroid', 'Supernova'], cats: [7, 7, 7, 7, 7, 7, 7, 7, 7, 7], basePrice: 1200, mult: 500, img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600' }
];

const adjectives = ["Premium", "Ultra", "Max", "Advanced", "Next-Gen", "High-Performance", "Sleek", "Professional", "Rugged", "Lite"];
const features = ["5G Connectivity", "OLED Display", "120Hz Refresh Rate", "Active Noise Cancellation", "AI Capabilities", "Long-lasting Battery", "Fast Charging", "Gorilla Glass Protection", "Water Resistant", "Hi-Res Audio"];

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function run() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'klyro_db'
        });

        console.log('Connected to DB. Starting insert of 140 products...');
        let count = 0;

        for (const brand of brands) {
            for (let i = 0; i < 10; i++) {
                const modelName = brand.lines[i] || (brand.name + ' Product ' + i);
                const title = brand.name + ' ' + modelName;
                const price = Math.round(brand.basePrice + (Math.random() * brand.mult * i));
                const discount = Math.round(price * (0.8 + Math.random() * 0.15)); // 5% to 20% discount
                const catId = brand.cats[i] || 1; 

                const desc = `Experience the ${getRandom(adjectives)} technology with the ${title}. Engineered for brilliance, featuring ${getRandom(features)} and ${getRandom(features)}. Built by ${brand.name} to deliver uncompromising performance and exceptional lifestyle aesthetics limitlessly.`;

                const query = `INSERT INTO products (name, description, price, category_id, image)
                               VALUES (?, ?, ?, ?, ?)`;
                
                await db.query(query, [
                    title, 
                    desc, 
                    price, 
                    catId, 
                    brand.img
                ]);
                count++;
                if (count % 20 === 0) console.log(`Inserted ${count} products...`);
            }
        }
        
        console.log(`SUCCESS! Inserted exactly ${count} products successfully across ${brands.length} brand categories.`);
        process.exit(0);
    } catch (e) {
        console.error("Migration failed: ", e);
        process.exit(1);
    }
}
run();
