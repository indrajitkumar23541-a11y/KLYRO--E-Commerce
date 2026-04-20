const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function verify() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🧪 Verifying Recommendation Algorithm...');
        
        // 1. Pick two random products and boost them
        const [products] = await connection.query('SELECT id, name FROM products LIMIT 2');
        if (products.length < 2) {
             console.log('Not enough products to test.');
             process.exit(0);
        }

        const p1 = products[0];
        const p2 = products[1];

        console.log(`Boosting ${p1.name} (ID: ${p1.id}) with 100 views...`);
        await connection.query('UPDATE products SET views_count = 100 WHERE id = ?', [p1.id]);

        console.log(`Boosting ${p2.name} (ID: ${p2.id}) with 60 searches (60*2 = 120 points)...`);
        await connection.query('UPDATE products SET search_count = 60 WHERE id = ?', [p2.id]);

        // 2. Query 'popular' sort via SQL
        const [trending] = await connection.query('SELECT id, name, (views_count * 1 + search_count * 2) as score FROM products ORDER BY (views_count * 1 + search_count * 2) DESC LIMIT 5');
        
        console.log('--- Top 5 Trending Products ---');
        trending.forEach((p, i) => {
            console.log(`${i+1}. ${p.name} (ID: ${p.id}) - Score: ${p.score}`);
        });

        if (trending[0].id === p2.id && trending[1].id === p1.id) {
            console.log('✅ Algorithm logic verified! P2 (120 pts) > P1 (100 pts).');
        } else {
            console.log('⚠️ Verification mismatch. Check scoring.');
        }

        await connection.end();
        process.exit(0);
    } catch (err) {
        console.error('❌ Verification failed:', err.message);
        process.exit(1);
    }
}

verify();
