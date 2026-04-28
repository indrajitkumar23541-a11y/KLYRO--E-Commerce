const express = require('express');
const router = express.Router();
const { chatWithExpert } = require('../controllers/aiController');

router.post('/chat', chatWithExpert);

module.exports = router;
