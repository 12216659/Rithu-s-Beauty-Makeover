const express = require('express');
const router = express.Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const rateLimit = require('express-rate-limit');

const { protect } = require('../middleware/authMiddleware');

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: 'Too many authentication attempts, please try again in 15 minutes'
});


// ==========================
// GENERATE JWT TOKEN
// ==========================
const generateToken = (id) => {

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: '30d',
        }
    );

};


// ==========================
// CLIENT SIGNUP
// ==========================
router.post('/signup', authLimiter, async (req, res) => {

    try {

        const {
            fullName,
            email,
            phone,
            password
        } = req.body;

        // ==========================
        // VALIDATION
        // ==========================
        if (
            !fullName ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({
                message: 'Please fill all required fields',
            });

        }

        // ==========================
        // CHECK EXISTING USER
        // ==========================
        const userExists = await User.findOne({
            email
        });

        if (userExists) {

            return res.status(400).json({
                message: 'User already exists',
            });

        }

        // ==========================
        // HASH PASSWORD
        // ==========================
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        // ==========================
        // CREATE USER
        // ==========================
        const user = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role: 'user',
        });

        // ==========================
        // RESPONSE
        // ==========================
        res.status(201).json({

            _id: user._id,

            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id),
            message: 'User registered successfully',

        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

});


// ==========================
// CLIENT LOGIN
// ==========================
router.post('/login', authLimiter, async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        // ==========================
        // FIND USER
        // ==========================
        const user = await User.findOne({
            email
        });

        // ==========================
        // CHECK PASSWORD
        // ==========================
        if (
            user &&
            (await bcrypt.compare(
                password,
                user.password
            ))
        ) {

            res.json({

                _id: user._id,

                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role || 'user',
                token: generateToken(user._id),
                message: 'Login successful',

            });

        } else {

            res.status(401).json({
                message: 'Invalid email or password',
            });

        }

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

});


// ==========================
// GOOGLE LOGIN / SIGNUP
// ==========================
router.post('/google', async (req, res) => {
    try {
        const { credential } = req.body;
        
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        const { email, name } = payload;
        
        // Check if user exists
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create user without password
            user = await User.create({
                fullName: name,
                email,
                role: 'user',
                // phone and password are not required now
            });
        }
        
        res.json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || '',
            role: user.role || 'user',
            token: generateToken(user._id),
            message: 'Google login successful',
        });
        
    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(500).json({
            message: 'Google Authentication failed',
        });
    }
});


// ==========================
// ADMIN SETUP
// ==========================
router.get('/setup', async (req, res) => {

    try {

        const adminExists = await User.findOne({
            role: 'admin'
        });

        if (adminExists) {

            return res.status(400).json({
                message: 'Admin already exists',
            });

        }

        // ==========================
        // HASH PASSWORD
        // ==========================
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            'revanth123',
            salt
        );

        // ==========================
        // CREATE ADMIN
        // ==========================
        const admin = await User.create({
            fullName: 'G Revanth',
            email: 'gunthakhanna830@gmail.com',
            phone: '9515229043',
            password: hashedPassword,
            role: 'admin',
        });

        res.status(201).json({

            message: 'Admin created successfully',

            admin: {

                email: admin.email,

                role: admin.role

            },

        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

});


// ==========================
// GET CURRENT USER
// ==========================
router.get('/me', protect, async (req, res) => {

    res.json(req.user);

});


// ==========================
// UPDATE CURRENT USER
// ==========================
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            user.address = req.body.address !== undefined ? req.body.address : user.address;
            
            const updatedUser = await user.save();
            
            res.json({
                _id: updatedUser._id,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                address: updatedUser.address,
                role: updatedUser.role,
                token: generateToken(updatedUser._id) // optionally refresh token
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;