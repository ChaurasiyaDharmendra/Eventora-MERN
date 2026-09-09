const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/email');

// =====================================================
// GENERATE OTP
// =====================================================

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// =====================================================
// GENERATE JWT TOKEN
// =====================================================

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// =====================================================
// REGISTER
// =====================================================

exports.register = async (req, res) => {
    try {

        const { name, email, password } = req.body;

        // Check existing user
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        // Create user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isVerified: false
        });

        // Generate OTP
        const otp = generateOTP();

        // Delete old verification OTP
        await OTP.findOneAndDelete({
            email,
            action: 'account_verification'
        });

        // Save new OTP
        await OTP.create({
            email,
            otp,
            action: 'account_verification'
        });

        // Send OTP email
        await sendOTPEmail(
            email,
            otp,
            'account_verification'
        );

        res.status(201).json({
            message: 'OTP sent to email. Please verify.',
            email: user.email
        });

    } catch (error) {

        console.error('Register Error:', error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// =====================================================
// LOGIN
// =====================================================

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        // Check account verification
        if (!user.isVerified && user.role !== 'admin') {

            const otp = generateOTP();

            // Delete old OTP
            await OTP.findOneAndDelete({
                email: user.email,
                action: 'account_verification'
            });

            // Create new OTP
            await OTP.create({
                email: user.email,
                otp,
                action: 'account_verification'
            });

            // Send OTP
            await sendOTPEmail(
                user.email,
                otp,
                'account_verification'
            );

            return res.status(403).json({
                message: 'Account not verified',
                needsVerification: true,
                email: user.email
            });
        }

        // Login successful
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(
                user.id,
                user.role
            )
        });

    } catch (error) {

        console.error('Login Error:', error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// =====================================================
// VERIFY ACCOUNT OTP
// =====================================================

exports.verifyOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        // Find valid OTP
        const validOTP = await OTP.findOne({
            email,
            otp,
            action: 'account_verification'
        });

        if (!validOTP) {
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            });
        }

        // Verify user
        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Delete OTP
        await OTP.deleteOne({
            _id: validOTP._id
        });

        // Login automatically
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(
                user.id,
                user.role
            )
        });

    } catch (error) {

        console.error('Verify OTP Error:', error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// =====================================================
// FORGOT PASSWORD
// =====================================================

exports.forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Generate OTP
        const otp = generateOTP();

        // IMPORTANT:
        // OTP model uses password_reset
        await OTP.findOneAndDelete({
            email,
            action: 'password_reset'
        });

        // Save new OTP
        await OTP.create({
            email,
            otp,
            action: 'password_reset'
        });

        // Send forgot password OTP email
        await sendOTPEmail(
            email,
            otp,
            'password_reset'
        );

        res.json({
            message: 'Password reset OTP sent to your email',
            email
        });

    } catch (error) {

        console.error('Forgot Password Error:', error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// =====================================================
// VERIFY FORGOT PASSWORD OTP
// =====================================================

exports.verifyForgotOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        // Find password reset OTP
        const validOTP = await OTP.findOne({
            email,
            otp,
            action: 'password_reset'
        });

        if (!validOTP) {
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            });
        }

        res.json({
            message: 'OTP verified successfully'
        });

    } catch (error) {

        console.error(
            'Verify Forgot OTP Error:',
            error
        );

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};

// =====================================================
// RESET PASSWORD
// =====================================================

exports.resetPassword = async (req, res) => {
    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;

        // Check password reset OTP
        const validOTP = await OTP.findOne({
            email,
            otp,
            action: 'password_reset'
        });

        if (!validOTP) {
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            newPassword,
            salt
        );

        // Update password
        user.password = hashedPassword;

        await user.save();

        // Delete used OTP
        await OTP.deleteOne({
            _id: validOTP._id
        });

        res.json({
            message:
                'Password reset successfully. You can now login.'
        });

    } catch (error) {

        console.error(
            'Reset Password Error:',
            error
        );

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};