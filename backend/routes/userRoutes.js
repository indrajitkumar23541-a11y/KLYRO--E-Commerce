const express = require('express');
const router = express.Router();
const { getUsers, updateAvatar } = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, admin, getUsers);

router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
