require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5007;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// AI Routes
app.use('/api/ai', require('./routes/aiRoutes'));

app.get('/health', (req, res) => {
    res.json({ service: 'KLYRO AI Expert', status: 'Thinking... 🤖' });
});

app.listen(PORT, () => {
    console.log(`🤖 AI Service is running on port ${PORT}`);
});

setInterval(() => {}, 1 << 30);
