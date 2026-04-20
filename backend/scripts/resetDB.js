const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const resetDB = async () => {
    try {
        console.log('🗑️  Resetting Database...');
        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        // Drop and Recreate DB
        await connection.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);
        await connection.query(`CREATE DATABASE \`${process.env.DB_NAME}\`;`);
        await connection.query(`USE \`${process.env.DB_NAME}\`;`);

        // Load Schema
        const schemaPath = path.join(__dirname, '../schema.sql');
        const schema = await fs.readFile(schemaPath, 'utf8');
        await connection.query(schema);

        console.log('✅ Database Reset Successfully');
        await connection.end();
    } catch (error) {
        console.error('❌ Error Resetting Database:', error.message);
        process.exit(1);
    }
};

resetDB();
