const { pool } = require('./config/db');

async function test() {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        console.log('Users in DB:', rows);
        process.exit(0);
    } catch (err) {
        console.error('Error querying DB:', err);
        process.exit(1);
    }
}

test();
