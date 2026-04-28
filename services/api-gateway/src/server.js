require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 5000;

// Logging
app.use(morgan('dev'));

// Rate Limiting (Increased for Development)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10000 // 10,000 requests per minute
});
app.use(limiter);

// --- SERVICE ROUTING (HPM v3 PATH FILTER) ---

// 🛡️ Identity Service
app.use(createProxyMiddleware({
    target: process.env.IDENTITY_SERVICE_URL,
    changeOrigin: true,
    pathFilter: '/api/auth'
}));

// 📦 Product Service
app.use(createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathFilter: ['/api/products', '/api/categories']
}));

// 🔍 Search Service
app.use(createProxyMiddleware({
    target: process.env.SEARCH_SERVICE_URL,
    changeOrigin: true,
    pathFilter: '/api/search'
}));

// 🔔 Notification Service
app.use(createProxyMiddleware({
    target: 'http://localhost:5006',
    changeOrigin: true,
    pathFilter: (path) => path.startsWith('/api/notifications')
}));

// 🤖 AI Service
app.use(createProxyMiddleware({
    target: process.env.AI_SERVICE_URL,
    changeOrigin: true,
    pathFilter: (path) => path.startsWith('/api/ai')
}));

// 🛒 Order Service
app.use(createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true,
    pathFilter: ['/api/orders', '/api/cart']
}));

// 👤 Back-Office Service (Monolith)
app.use(createProxyMiddleware({
    target: process.env.MONOLITH_SERVICE_URL,
    changeOrigin: true,
    pathFilter: ['/api/users', '/api/seller', '/api/admin', '/api/support', '/uploads']
}));

// Health Check
app.get('/health', (req, res) => {
    res.json({ service: 'KLYRO API Gateway', status: 'Operational 🌐' });
});

app.listen(PORT, () => {
    console.log(`🌐 API Gateway is running on port ${PORT}`);
});

// Keep alive
setInterval(() => {}, 1 << 30);
