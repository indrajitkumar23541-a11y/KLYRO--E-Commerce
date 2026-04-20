const mysql = require('mysql2/promise');

async function seed() {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Indrajit@7061',
        database: 'klyro_db'
    });

    try {
        console.log('--- Syncing Categories ---');
        const categories = [
            { id: 22, name: 'Skincare', parent_id: 21 },
            { id: 23, name: 'Haircare', parent_id: 21 },
            { id: 24, name: 'Makeup', parent_id: 21 },
            { id: 25, name: 'Fragrance', parent_id: 21 },
            { id: 60, name: 'Personal Care', parent_id: 21 },
            { id: 61, name: 'Ayurveda', parent_id: 21 },
            { id: 62, name: 'Baby Care', parent_id: 21 }
        ];

        for (const cat of categories) {
            await db.execute(
                'INSERT INTO categories (id, name, parent_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), parent_id=VALUES(parent_id)',
                [cat.id, cat.name, cat.parent_id]
            );
        }
        console.log('Categories synced.');

        console.log('--- Seeding Beauty Products ---');
        const products = [
            // Skincare (22)
            { name: 'CeraVe Hydrating Cleanser', price: 1299, cat: 22, img: 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/master/us/products/hydrating-facial-cleanser/717x717/cerave_hydrating_facial_cleanser_12oz_front-v3.png' },
            { name: 'Minimalist 10% Vitamin C', price: 699, cat: 22, img: 'https://v1.bebeautystage.com/wp-content/uploads/2021/08/Minimalist-Logo-scaled.jpg' },
            // Haircare (23)
            { name: 'WOW Onion Hair Oil', price: 499, cat: 23, img: 'https://www.wowskinscience.com/cdn/shop/files/WOW_Logo_300x.png' },
            { name: 'L\'Oréal Professional Scalp Expert', price: 850, cat: 23, img: 'https://www.lorealprofessionnel.com/-/media/project/loreal/brand-sites/lp/master/products/hair-care/scalp-advanced/shampoo/front.png' },
            // Makeup (24)
            { name: 'Lakme 9to5 Primer Matte', price: 550, cat: 24, img: 'https://www.lakmeindia.com/cdn/shop/products/27237_H1_8901030742721_1000x1000.jpg' },
            { name: 'Maybelline Superstay Lipstick', price: 799, cat: 24, img: 'https://www.maybelline.com/-/media/project/loreal/brand-sites/mny/master/us/products/lip-makeup/lipstick/superstay-matte-ink-liquid-lip-color/maybelline-lipstick-superstay-matte-ink-pioneer-041554496895-o.png' },
            // Fragrance (25)
            { name: 'Dior Sauvage Eau de Parfum', price: 11500, cat: 25, img: 'https://www.dior.com/dw/image/v2/BGHB_PRD/on/demandware.static/-/Sites-master_dior/default/dwb7b6c7e1/assets/Y0996443/Y0996443_F099644309_E01_ZHC.jpg' },
            { name: 'Bvlgari Man In Black', price: 9200, cat: 25, img: 'https://www.bulgari.com/dw/image/v2/BCSR_PRD/on/demandware.static/-/Sites-masterCatalog_Bulgari/default/dw18b1c1b1/70000/70991.png' },
            // Ayurveda (61)
            { name: 'Kama Ayurveda Kumkumadi Oil', price: 2995, cat: 61, img: 'https://www.kamaayurveda.com/cdn/shop/products/Kumkumadi-Miraculous-Beauty-Fluid-A-12ml.jpg' },
            { name: 'Forest Essentials Soundarya Face Cream', price: 4800, cat: 61, img: 'https://www.forestessentialsindia.com/media/catalog/product/s/o/soundarya_radiance_cream_with_24k_gold_spf25_30g_1.png' },
            // Baby Care (62)
            { name: 'Johnson\'s Baby Powder', price: 250, cat: 62, img: 'https://www.johnsonsbaby.com/sites/jbaby_us/files/jbaby_powder_15oz_front.png' },
            { name: 'Himalaya Baby Lotion', price: 195, cat: 62, img: 'https://himalayawellness.in/cdn/shop/products/baby-lotion-200ml.jpg' },
            // Personal Care (60)
            { name: 'Dove Deep Moisture Body Wash', price: 350, cat: 60, img: 'https://www.dove.com/content/dam/unilever/dove/united_states_of_america/packaging_visual/011111610735.01-864024-png.png' },
            { name: 'Nivea Soft Moisturizing Cream', price: 299, cat: 60, img: 'https://www.nivea.in/-/media/project/beiersdorf/nivea/international/products/body-care/soft/soft-200ml-front.png' }
        ];

        for (const p of products) {
            await db.execute(
                'INSERT INTO products (name, description, price, category_id, image) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE price=VALUES(price), category_id=VALUES(category_id), image=VALUES(image)',
                [p.name, `${p.name} - Premium Beauty Essence`, p.price, p.cat, p.img]
            );
        }
        console.log('Seeding completed successfully!');

    } catch (err) {
        console.error('Seeding error:', err);
    } finally {
        await db.end();
    }
}

seed();
