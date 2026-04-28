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
        console.log('✅ Notification Service: MySQL Connected Successfully');
        
        // Auto-create table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type VARCHAR(50) NOT NULL, -- email, in-app, push
                title VARCHAR(255),
                message TEXT,
                status ENUM('unread', 'read') DEFAULT 'unread',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        connection.release();
    } catch (error) {
        console.error('❌ Notification Service: MySQL Connection Failed:', error);
        process.exit(1);
    }
};

module.exports = { pool, connectDB };
