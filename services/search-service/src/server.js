require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/search', require('./routes/searchRoutes'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ service: 'KLYRO Search Microservice', status: 'Operational 🔍' });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🔍 Search Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start Search Service:', error);
    }
};

startServer();

// Keep alive
setInterval(() => {}, 1 << 30);
