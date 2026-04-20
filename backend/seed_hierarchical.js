const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedHierarchical() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: true
    });

    try {
        console.log('--- Phase 1: Database Migration ---');
        
        // 1. Alter categories table to add parent_id and composite unique constraint
        try {
            await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
            
            // Add parent_id if not exists
            const [columns] = await connection.query("SHOW COLUMNS FROM categories LIKE 'parent_id'");
            if (columns.length === 0) {
                await connection.query('ALTER TABLE categories ADD COLUMN parent_id INT NULL');
                console.log('✅ Added parent_id column.');
            }

            // Remove old unique constraint on name if it exists
            try {
                await connection.query('ALTER TABLE categories DROP INDEX name');
                console.log('✅ Removed old unique index on name.');
            } catch (e) {
                // If it fails, maybe the index name is different or doesn't exist
            }

            // Force add the new hierarchical unique constraint
            try {
                await connection.query('ALTER TABLE categories ADD UNIQUE KEY unique_category (name, parent_id)');
                console.log('✅ Added composite unique constraint (name, parent_id).');
            } catch (e) {
                if (e.code === 'ER_DUP_KEYNAME') console.log('ℹ️ unique_category index already exists.');
            }

            // Maintain Foreign Key
            try {
                await connection.query(`
                    ALTER TABLE categories 
                    ADD CONSTRAINT fk_categories_parent 
                    FOREIGN KEY (parent_id) 
                    REFERENCES categories(id) 
                    ON DELETE CASCADE;
                `);
                console.log('✅ Added foreign key constraint.');
            } catch (e) {
                if (e.code === 'ER_DUP_CONSTRAINT_NAME') console.log('ℹ️ foreign key constraint already exists.');
            }

            await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        } catch (err) {
            console.error('❌ Migration Error:', err.message);
        }

        console.log('--- Phase 2: Cleaning Data ---');
        // Delete categories (will cascade delete subcategories if they existed)
        // Set product category_id to NULL temporarily
        await connection.query('SET FOREIGN_KEY_CHECKS = 0;');
        await connection.query('DELETE FROM categories;');
        await connection.query('ALTER TABLE categories AUTO_INCREMENT = 1;');
        console.log('✅ Categories table cleared and IDs reset.');

        console.log('--- Phase 3: Seeding Hierarchical Categories ---');
        
        const hierData = {
            'Electronics': ['Mobiles', 'Laptops', 'Tablets', 'Smart Gadgets', 'Accessories', 'Watches'],
            'Fashion': ['Men', 'Women', 'Kids', 'Footwear', 'Accessories', 'Bags', 'Watches'],
            'Home & Living': ['Furniture', 'Kitchen', 'Decor', 'Lighting'],
            'Beauty & Health': ['Skincare', 'Haircare', 'Makeup', 'Supplements'],
            'Sports & Fitness': ['Gym Equipment', 'Yoga', 'Outdoor Sports'],
            'Grocery & Essentials': ['Food Items', 'Beverages', 'Daily Use'],
            'Kids & Baby': ['Toys', 'Baby Care', 'Clothing'],
            'Automotive': ['Car Accessories', 'Bike Accessories'],
            'Books & Education': ['Books', 'Stationery', 'Study Material'],
            'Others': ['Pet Supplies', 'Tools', 'Musical Instruments']
        };

        const categoryIds = {};

        for (const [main, subs] of Object.entries(hierData)) {
            const [result] = await connection.query('INSERT INTO categories (name, parent_id) VALUES (?, NULL)', [main]);
            const parentId = result.insertId;
            categoryIds[main] = parentId;
            console.log(`🏠 Main Category: ${main} (ID: ${parentId})`);

            for (const sub of subs) {
                const [subResult] = await connection.query('INSERT INTO categories (name, parent_id) VALUES (?, ?)', [sub, parentId]);
                categoryIds[`${main} > ${sub}`] = subResult.insertId;
                console.log(`   └─ Sub: ${sub} (ID: ${subResult.insertId})`);
            }
        }

        console.log('--- Phase 4: Product Reassignment ---');
        // Reassign sample products to new subcategories
        const productMapping = {
            'Classic White Tee': 'Fashion > Women',
            'Denim Jacket': 'Fashion > Men',
            'Leather Messenger Bag': 'Fashion > Accessories',
            'Canvas Sneakers': 'Fashion > Footwear', // or Sports
            'Minimalist Gold Watch': 'Fashion > Accessories',
            'Floral Summer Dress': 'Fashion > Women',
            'Slim Fit Chinos': 'Fashion > Men'
        };

        for (const [prodName, subName] of Object.entries(productMapping)) {
            const subId = categoryIds[subName];
            if (subId) {
                await connection.query('UPDATE products SET category_id = ? WHERE name = ?', [subId, prodName]);
                console.log(`🔗 Linked "${prodName}" to "${subName}"`);
            }
        }

        await connection.query('SET FOREIGN_KEY_CHECKS = 1;');
        console.log('✅ Seed and Mapping Complete.');
        console.log('Category IDs mapping summary:', categoryIds);

    } catch (error) {
        console.error('❌ Error during seeding:', error.message);
    } finally {
        await connection.end();
    }
}

seedHierarchical();
