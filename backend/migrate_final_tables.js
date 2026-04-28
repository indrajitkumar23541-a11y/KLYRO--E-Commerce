const mysql = require('mysql2/promise');
const run = async () => {
    const c = await mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_product_db'
    });
    
    console.log('--- Updating Product Table ---');
    const cols = [
        { name: 'search_count', type: 'INT DEFAULT 0' }
    ];

    for (const col of cols) {
        try {
            await c.query(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type}`);
            console.log(`Added column: ${col.name}`);
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log(`Column ${col.name} exists.`);
            else throw err;
        }
    }

    console.log('--- Creating Advanced Tables ---');
    await c.query(`
        CREATE TABLE IF NOT EXISTS product_images (
            id INT AUTO_INCREMENT PRIMARY KEY,
            product_id INT NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            is_primary BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
    `);
    console.log('Table product_images created.');

    await c.query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            product_id INT NOT NULL,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
        )
    `);
    console.log('Table reviews created.');
    
    await c.end();
};
run();
