const mysql = require('mysql2/promise');
const run = async () => {
    const c = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_product_db'
    });
    
    const columns = [
        { name: 'stock_quantity', type: 'INT DEFAULT 10' },
        { name: 'rating', type: 'DECIMAL(2,1) DEFAULT 4.5' },
        { name: 'num_reviews', type: 'INT DEFAULT 0' },
        { name: 'views_count', type: 'INT DEFAULT 0' }
    ];

    for (const col of columns) {
        try {
            await c.query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
            console.log(`Added column: ${col.name}`);
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log(`Column ${col.name} already exists.`);
            } else {
                throw err;
            }
        }
    }
    
    await c.end();
};
run();
