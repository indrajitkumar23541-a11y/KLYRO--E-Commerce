const express = require('express');
const router = express.Router();
const { getUsers, updateAvatar } = require('../controllers/userController');
const { protect, admin } = require('../../../shared/middleware/authMiddleware');
const upload = require('../../../shared/middleware/uploadMiddleware');

router.route('/')
    .get(protect, admin, getUsers);

router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
