const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

async function cleanDuplicateCategories() {
    console.log("Connecting to Database...");
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_db',
        port: 3307 // external mapped port
    });

    try {
        console.log("Connected. Finding duplicate categories...");
        const [categories] = await connection.execute('SELECT id, name FROM categories ORDER BY id ASC');
        
        const seenNames = new Map();
        
        for (const cat of categories) {
            if (seenNames.has(cat.name)) {
                const originalId = seenNames.get(cat.name);
                const duplicateId = cat.id;
                console.log(`Found duplicate: ${cat.name} (Keep: ${originalId}, Delete: ${duplicateId})`);
                
                // Update products to use originalId instead of duplicateId
                await connection.execute('UPDATE products SET category_id = ? WHERE category_id = ?', [originalId, duplicateId]);
                
                // Also update any child categories that point to this parent
                await connection.execute('UPDATE categories SET parent_id = ? WHERE parent_id = ?', [originalId, duplicateId]);
                
                // Delete the duplicate
                await connection.execute('DELETE FROM categories WHERE id = ?', [duplicateId]);
                console.log(`Merged and deleted ${duplicateId}`);
            } else {
                seenNames.set(cat.name, cat.id);
            }
        }
        
        console.log("Done cleaning duplicate categories.");
    } catch (error) {
        console.error("Error:", error);
    } finally {
        await connection.end();
    }
}

cleanDuplicateCategories();
