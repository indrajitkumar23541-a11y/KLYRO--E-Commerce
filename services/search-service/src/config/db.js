const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Search Service: MySQL Connected Successfully');
        connection.release();
    } catch (error) {
        console.error('❌ Search Service: MySQL Connection Failed:', error);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };
