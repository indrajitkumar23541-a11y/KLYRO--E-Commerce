const express = require('express');
const router = express.Router();
const { handleConciergeChat, handleProductExpert } = require('../controllers/supportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, handleConciergeChat);
router.post('/expert', handleProductExpert);

module.exports = router;
