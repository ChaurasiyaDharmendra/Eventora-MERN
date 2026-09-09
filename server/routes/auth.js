const express = require('express');

const router = express.Router();

const {
    register,
    login,
    verifyOTP,
    forgotPassword,
    verifyForgotOTP,
    resetPassword
} = require('../controllers/authController');

router.post('/register', register);

router.post('/login', login);

router.post('/verify-otp', verifyOTP);

// Forgot Password
router.post('/forgot-password', forgotPassword);

router.post('/verify-forgot-otp', verifyForgotOTP);

router.post('/reset-password', resetPassword);

module.exports = router;