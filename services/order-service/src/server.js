require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { connectProducer } = require('./config/kafka');

const app = express();
const PORT = process.env.PORT || 5004;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Order & Cart Routes
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ service: 'KLYRO Order Microservice', status: 'Operational 🛒' });
});

// Error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Order Service Error'
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        await connectProducer();
        app.listen(PORT, () => {
            console.log(`🛒 Order Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start Order Service:', error);
        process.exit(1);
    }
};

startServer();

// Keep alive
setInterval(() => {}, 1 << 30);
