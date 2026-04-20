const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const updateImages = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('🔄 Updating Learning Toys with Custom Hi-Res Local Images...');

        const updates = [
            { name: "LEGO Classic Large Creative Brick Box", image: "/images/toys/lego_classic.png" },
            { name: "Fisher-Price Rock-a-Stack", image: "/images/toys/rock_a_stack.png" },
            { name: "Magna-Tiles 32-Piece Clear Colors Set", image: "/images/toys/magna_tiles.png" },
            { name: "LeapFrog Learning Friends 100 Words Book", image: "/images/toys/leapfrog_book.png" },
            { name: "Melissa & Doug Wooden Pattern Blocks", image: "/images/toys/pattern_blocks.png" },
            { name: "Smartivity Pump It Move It Hydraulic Crane", image: "/images/toys/hydraulic_crane.png" },
            { name: "Skillmatics Brain Games Educational Activity", image: "/images/toys/brain_games.png" },
            { name: "Shifu Orboot Earth Interactive AR Globe", image: "/images/toys/orboot_globe.png" },
            { name: "Rubik's Cube 3x3 Original", image: "/images/toys/rubiks_cube.png" },
            { name: "Einstein Box for Early Learning", image: "/images/toys/einstein_box.png" }
        ];

        for (const update of updates) {
            const [result] = await connection.query('UPDATE products SET image = ? WHERE name = ?', [update.image, update.name]);
            if (result.affectedRows > 0) {
                console.log(`✅ Updated image for: ${update.name}`);
            } else {
                console.log(`❌ Product not found: ${update.name}`);
            }
        }

        await connection.end();
        console.log('🚀 Learning Toys Image Update Complete!');
    } catch (error) {
        console.error('❌ Update failed:', error.message);
    }
};

updateImages();
