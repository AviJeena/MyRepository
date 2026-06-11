const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new student account
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, department } = req.body;
        
        let userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already registered with this email.' });
        }

        const newUser = await User.create({ username, email, password, department });
        res.status(201).json({ message: 'User registered successfully!', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & return system token access
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        
        if (!user || user.password !== password) { // Note: Use bcrypt hashing in production
            return res.status(401).json({ message: 'Invalid academic credentials.' });
        }

        res.status(200).json({ message: 'Login successful', userId: user._id, username: user.username });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;