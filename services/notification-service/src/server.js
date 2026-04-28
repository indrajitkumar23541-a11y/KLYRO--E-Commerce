require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const { connectConsumer } = require('./config/kafka');
const setupKafkaConsumer = require('./events/kafkaConsumer');

const app = express();
const PORT = process.env.PORT || 5006;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ service: 'KLYRO Notification Microservice', status: 'Operational 🔔' });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        await connectConsumer();
        await setupKafkaConsumer();
        app.listen(PORT, () => {
            console.log(`🔔 Notification Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start Notification Service:', error);
    }
};

startServer();

// Keep alive
setInterval(() => {}, 1 << 30);
