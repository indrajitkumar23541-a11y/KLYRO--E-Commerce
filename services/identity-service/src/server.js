require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Identity Routes
app.use('/api/auth', require('./routes/authRoutes'));

// Health Check
app.get('/health', (req, res) => {
    res.json({ service: 'KLYRO Identity Microservice', status: 'Running 🛡️' });
});

// Error handling
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Identity Service Error'
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🛡️ Identity Service is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start Identity Service:', error);
        process.exit(1);
    }
};

startServer();

// Keep alive
setInterval(() => {}, 1 << 30);
