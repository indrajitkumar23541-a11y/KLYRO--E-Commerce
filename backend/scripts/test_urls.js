const https = require('https');

const urls = [
    "https://m.media-amazon.com/images/I/81b2X0jBgwL.jpg",
    "https://m.media-amazon.com/images/I/71Xm3z04N4L.jpg",
    "https://m.media-amazon.com/images/I/81UsqM7mZAL.jpg",
    "https://m.media-amazon.com/images/I/81TzZq9R2QL.jpg",
    "https://m.media-amazon.com/images/I/910J784vQzL.jpg",
    "https://m.media-amazon.com/images/I/81k39Y3aMvL.jpg",
    "https://m.media-amazon.com/images/I/81mD+sU-C5L.jpg",
    "https://m.media-amazon.com/images/I/71WwQJ0dxyL.jpg",
    "https://m.media-amazon.com/images/I/71lC57P5WGL.jpg",
    "https://m.media-amazon.com/images/I/81vNmbZ5v7L.jpg"
];

const checkUrl = (url) => {
    return new Promise((resolve) => {
        https.get(url, (res) => {
            console.log(`[${res.statusCode}] ${url}`);
            resolve();
        }).on('error', (e) => {
            console.log(`[ERROR] ${url} : ${e.message}`);
            resolve();
        });
    });
};

async function testAll() {
    for (const u of urls) {
        await checkUrl(u);
    }
}

testAll();
