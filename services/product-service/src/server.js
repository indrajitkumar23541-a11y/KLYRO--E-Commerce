require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { connectConsumer } = require('./config/kafka');
const setupKafkaConsumer = require('./events/kafkaConsumer');

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Product Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ service: 'KLYRO Product Microservice', status: 'Operational 📦' });
});

// Error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Product Service Error'
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        await connectConsumer();
        await setupKafkaConsumer();
        app.listen(PORT, () => {
            console.log(`📦 Product Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start Product Service:', error);
        process.exit(1);
    }
};

startServer();

// Keep alive
setInterval(() => {}, 1 << 30);
