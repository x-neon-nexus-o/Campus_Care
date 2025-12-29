const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const { protect } = require('../middleware/authMiddleware');
// const rateLimit = require('express-rate-limit');

// const loginLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // 5 attempts
//   message: 'Too many login attempts, try again later',
// });

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin-login', authController.adminLogin);

// 2FA Routes
router.get('/2fa/setup', protect, authController.setup2FA);
router.post('/2fa/verify', protect, authController.verify2FA);

router.post('/forgot-password', authController.forgotPassword);
router.post('/reset', authController.resetPassword);
router.get('/profile', protect, authController.getProfile);
router.get('/users', protect, authController.getUsers);

module.exports = router;