const express = require('express');
const router = express.Router();

const User = require('../models/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { protect } = require('../middleware/authMiddleware');


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
router.post('/signup', async (req, res) => {

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
router.post('/login', async (req, res) => {

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


module.exports = router;