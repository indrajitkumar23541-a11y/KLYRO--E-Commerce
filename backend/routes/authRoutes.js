const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateUserProfile, updateUserPassword, registerSeller, updateAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', registerUser);
router.post('/register-seller', registerSeller);
router.post('/login', loginUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.put('/password', protect, updateUserPassword);
router.put('/avatar', protect, upload.single('avatar'), updateAvatar);

module.exports = router;
