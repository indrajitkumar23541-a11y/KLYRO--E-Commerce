const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

const filterColumns = (data, columns) => {
    const filtered = {};
    for (let col of columns) {
        if (data.hasOwnProperty(col)) {
            filtered[col] = data[col];
        }
    }
    return filtered;
};

const getTableColumns = async (conn, table) => {
    const [cols] = await conn.query(`DESCRIBE ${table}`);
    return cols.map(c => c.Field);
};

const migrateTable = async (sourceConn, targetConn, table) => {
    try {
        const [exists] = await sourceConn.query(`SHOW TABLES LIKE '${table}'`);
        if (exists.length === 0) {
            console.log(`⚠️ Skipping table ${table} (Not found in source)`);
            return;
        }
        console.log(`📡 Migrating table: ${table}...`);
        const [rows] = await sourceConn.query(`SELECT * FROM ${table}`);
        const columns = await getTableColumns(targetConn, table);
        
        for (let row of rows) {
            const filteredRow = filterColumns(row, columns);
            await targetConn.query(`INSERT IGNORE INTO ${table} SET ?`, filteredRow);
        }
    } catch (error) {
        console.warn(`⚠️ Failed to migrate table ${table}: ${error.message}`);
    }
};

const migrate = async () => {
    try {
        console.log('🚀 Starting Robust Data Migration...');
        
        const sourceConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'klyro_db'
        });

        // 1. Identity DB
        const identityConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'klyro_identity_db'
        });
        await migrateTable(sourceConn, identityConn, 'users');
        await identityConn.end();

        // 2. Product DB
        const productConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'klyro_product_db'
        });
        await productConn.query('SET FOREIGN_KEY_CHECKS = 0');
        await migrateTable(sourceConn, productConn, 'categories');
        await migrateTable(sourceConn, productConn, 'products');
        await productConn.query('SET FOREIGN_KEY_CHECKS = 1');
        await productConn.end();

        // 3. Order DB
        const orderConn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'klyro_order_db'
        });
        await orderConn.query('SET FOREIGN_KEY_CHECKS = 0');
        await migrateTable(sourceConn, orderConn, 'cart');
        await migrateTable(sourceConn, orderConn, 'cart_items');
        await migrateTable(sourceConn, orderConn, 'orders');
        await migrateTable(sourceConn, orderConn, 'order_items');
        await orderConn.query('SET FOREIGN_KEY_CHECKS = 1');
        await orderConn.end();

        await sourceConn.end();
        console.log('✅ Robust Migration Completed Successfully!');
    } catch (error) {
        console.error('❌ Migration Failed:', error);
    }
};

migrate();

