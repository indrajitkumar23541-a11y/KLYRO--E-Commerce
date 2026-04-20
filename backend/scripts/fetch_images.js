const https = require('https');
const fs = require('fs');

async function searchImage(query) {
    return new Promise((resolve) => {
        const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        const req = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const imgMatches = data.match(/<img[^>]+src="([^">]+)"/g);
                if (imgMatches) {
                    console.log(`\n=== Query: ${query} ===`);
                    imgMatches.slice(0, 3).forEach(m => {
                        const src = m.match(/src="([^">]+)"/)[1];
                        console.log(src.startsWith('//') ? 'https:' + src : src);
                    });
                } else {
                     console.log(`\n=== Query: ${query} ===\nNo images found.`);
                }
                resolve();
            });
        });
        req.on('error', (err) => {
            console.error(`Error for ${query}:`, err.message);
            resolve();
        });
    });
}

const toys = [
    "LEGO Classic Large Creative Brick Box amazon.in",
    "Fisher-Price Rock-a-Stack toy",
    "Magna-Tiles 32-Piece Build Set",
    "LeapFrog Learning Friends 100 Words Book",
    "Melissa & Doug Wooden Pattern Blocks toy",
    "Smartivity Hydraulic Crane STEM Toy",
    "Skillmatics Brain Games Activity Mats",
    "Shifu Orboot Interactive AR Globe",
    "Rubik's Cube 3x3 Original toy",
    "Einstein Box for Early Learning"
];

async function run() {
    for (const toy of toys) {
        await searchImage(toy + ' filetype:jpg');
        await new Promise(r => setTimeout(r, 2000));
    }
}

run();
