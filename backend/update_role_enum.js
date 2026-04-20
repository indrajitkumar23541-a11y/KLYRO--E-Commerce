const { pool } = require('./config/db');

async function updateRoleEnum() {
    try {
        console.log('Altering users table to add seller role...');
        await pool.query("ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin', 'seller') DEFAULT 'user'");
        console.log('Successfully updated users table!');
        process.exit(0);
    } catch (err) {
        console.error('Error updating users table:', err.message);
        process.exit(1);
    }
}

updateRoleEnum();
