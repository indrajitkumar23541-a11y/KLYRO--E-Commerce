const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const products = [
    // Women (10)
    { name: "Gucci Flora Georgette Midi Dress", price: 295000, category_id: 10, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=800", description: "Elegant floral georgette dress with a pleated skirt. Perfect for evening galas and luxury events." },
    { name: "Armani Exchange Velvet Blazer", price: 45000, category_id: 10, image: "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80&w=800", description: "Premium tailored velvet blazer. Sleek structural design for formal and semi-formal wear." },
    { name: "H&M Premium Silk Blouse", price: 8999, category_id: 10, image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?auto=format&fit=crop&q=80&w=800", description: "Minimalist pure silk blouse with a soft sheen. Flowing fit for a sophisticated everyday look." },
    { name: "Levi's Ribcage Straight Ankle Jeans", price: 7500, category_id: 10, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800", description: "High-rise straight ankle jeans in classic denim. Crafted for comfort and timeless style." },
    
    // Men (9)
    { name: "Armani Tailored Two-Piece Wool Suit", price: 185000, category_id: 9, image: "https://images.unsplash.com/photo-1593030761757-71fae46af504?auto=format&fit=crop&q=80&w=800", description: "Luxurious Italian wool suit featuring a sharp slim fit. The ultimate statement of business elegance." },
    { name: "Gucci GG Supreme Cotton Polo", price: 62000, category_id: 9, image: "https://images.unsplash.com/photo-1586363104862-3a5e222eca01?auto=format&fit=crop&q=80&w=800", description: "Classic preppy cotton polo shirt with signature GG motif embroidery and striped collar." },
    { name: "Levi's 501 Original Fit Jeans", price: 6999, category_id: 9, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800", description: "The iconic 501 straight-leg denim jeans. Durable, classic, and an essential wardrobe staple." },
    { name: "H&M Cashmere Blend Overcoat", price: 21000, category_id: 9, image: "https://images.unsplash.com/photo-1520975954732-57dd22299614?auto=format&fit=crop&q=80&w=800", description: "Elegant winter overcoat crafted from a premium cashmere blend for supreme warmth and style." },

    // Footwear (12)
    { name: "Nike Air Jordan 1 Retro High", price: 24500, category_id: 12, image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&q=80&w=800", description: "Legendary high-top sneakers in premium leather. The ultimate streetwear icon." },
    { name: "Adidas Ultraboost 1.0 DNA", price: 17999, category_id: 12, image: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&q=80&w=800", description: "High-performance running shoes with responsive Boost cushioning and adaptive Primeknit." },
    { name: "Puma RS-X³ Puzzle Sneakers", price: 10999, category_id: 12, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80&w=800", description: "Chunky retro-futuristic sneakers with extreme cushioning and bold color-blocking." },
    { name: "Gucci Ace Leather Sneakers", price: 78000, category_id: 12, image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&q=80&w=800", description: "Classic low-top leather sneakers featuring the signature Gucci vintage web stripe." },

    // Watches (15)
    { name: "Armani Exchange Chronograph Watch", price: 22000, category_id: 15, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800", description: "Sleek stainless steel chronograph watch with a black sunray dial and sophisticated detailing." },
    { name: "Gucci Grip G-Timeless Watch", price: 145000, category_id: 15, image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800", description: "Unique retro-inspired automatic timepiece with signature interlocking G motif." },

    // Bags (14)
    { name: "Gucci Marmont Matelassé Shoulder Bag", price: 195000, category_id: 14, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=800", description: "Iconic chevron leather shoulder bag embellished with the signature double G hardware." },
    { name: "Puma Fundamentals Sports Duffel", price: 3499, category_id: 14, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800", description: "Durable and spacious sports duffel bag, perfect for gym essentials or short weekend trips." },

    // Accessories (13)
    { name: "Gucci Reversible Leather Interlocking Belt", price: 55000, category_id: 13, image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&q=80&w=800", description: "Premium reversible leather belt featuring the iconic gold-toned interlocking G buckle." },
    { name: "Armani Exchange Aviator Sunglasses", price: 12500, category_id: 13, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=800", description: "Classic metal aviator sunglasses with gradient lenses. Combines vintage style with modern luxury." },
    
    // Kids (11)
    { name: "Nike Kids Air Max 90", price: 8500, category_id: 11, image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&q=80&w=800", description: "Iconic Air Max cushioning designed specially for growing feet. Durable and highly comfortable." },
    { name: "H&M Kids Cotton Cargo Joggers", price: 2299, category_id: 11, image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800", description: "Soft cotton twill joggers with cargo pockets. Durable for everyday play and adventures." }
];

const seedProducts = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🌱 Seeding Fashion Products...');
        let count = 0;

        for (const product of products) {
            await connection.execute(
                `INSERT INTO products (name, price, category_id, image, description) VALUES (?, ?, ?, ?, ?)`,
                [product.name, product.price, product.category_id, product.image, product.description]
            );
            count++;
            console.log(`✅ Inserted: ${product.name}`);
        }

        console.log(`🎉 Successfully seeded ${count} premium fashion products!`);
        await connection.end();
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
    }
};

seedProducts();
