const express = require('express');
const router = express.Router();
const authController = require('../controllers/authcontroller');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, try again later',
});

router.post('/register', authController.register);
router.post('/login', loginLimiter, authController.login);
router.post('/admin-login', loginLimiter, authController.adminLogin);
router.post('/forgot', authController.forgotPassword);
router.post('/reset', authController.resetPassword);

module.exports = router;