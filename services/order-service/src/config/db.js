const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// 1. Validate Environment Variables
console.log('--- [PROD] Database Validation ---');
console.log(`DB_HOST: ${process.env.DB_HOST}`);
console.log(`DB_USER: ${process.env.DB_USER}`);
console.log(`DB_NAME: ${process.env.DB_NAME}`);
// Masking password for safety but confirming it's read
const pass = process.env.DB_PASSWORD || '';
console.log(`DB_PASS: ${pass ? pass.substring(0, 2) + '*'.repeat(pass.length - 2) : '(empty)'}`);
console.log('---------------------------------');

const connectDB = async () => {
    try {
        console.log('⏳ Connecting to MySQL...');

        // Connect to MySQL
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        // Ensure Database Exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);
        
        // Check if basic tables exist to avoid destructive re-runs
        const [tables] = await connection.query(`SHOW TABLES LIKE 'users';`);
        
        if (tables.length === 0) {
            console.log('📦 Initializing Database Schema...');
            const schemaPath = path.join(__dirname, '../../schema.sql');
            const schema = await fs.readFile(schemaPath, 'utf8');
            await connection.query(schema);
            console.log(`✨ Database "${process.env.DB_NAME}" initialized successfully.`);
        } else {
            console.log(`✨ Database "${process.env.DB_NAME}" is up to date.`);
        }
        
        await connection.end();
        console.log("✅ MySQL Connected Successfully");
    } catch (error) {
        console.error("❌ MySQL Connection/Schema Failed!");
        console.error(`Error Code: ${error.code}`);
        console.error(`Message: ${error.message}`);
        // Log stack trace for better debugging in dev
        if (process.env.NODE_ENV === 'development') console.error(error.stack);
        // Do not exit process here to allow the pool to retry or stay alive for debugging
    }
};

// Create a pool for the application to use
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});

module.exports = { connectDB, pool };
