require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/shared/config/db');

// Connect to Database
// (Handled in startServer below)

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/users', require('./src/domains/user/routes/userRoutes'));
app.use('/api/admin', require('./src/domains/admin/routes/adminRoutes'));
app.use('/api/seller', require('./src/domains/seller/routes/sellerRoutes'));
app.use('/api/support', require('./src/domains/support/routes/supportRoutes'));

// Root Route
app.get('/', (req, res) => {
    res.json({ message: 'KLYRO Premium API is running smoothly 🚀' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// Start Server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

// Keep the process alive for persistent connection management
setInterval(() => {}, 1 << 30);