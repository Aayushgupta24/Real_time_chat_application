
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                error: 'Username, email, and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: email.toLowerCase() },
                { username: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: existingUser.email === email.toLowerCase() 
                    ? 'Email already registered' 
                    : 'Username already taken'
            });
        }

        // Create new user
        const user = new User({
            username: username.trim(),
            email: email.toLowerCase().trim(),
            password
        });

        await user.save();
        
        const token = jwt.sign(
            { userId: user._id }, 
            process.env.JWT_SECRET || 'your-fallback-secret-key'
        );

        res.json({ 
            token, 
            username: user.username,
            email: user.email 
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(400).json({ 
            error: error.message || 'Registration failed',
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        console.log('Login request received:', {
            body: req.body,
            headers: req.headers['content-type']
        });

        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            console.log('Missing credentials:', { username: !!username, password: !!password });
            return res.status(400).json({ 
                error: 'Username and password are required',
                details: {
                    username: !username ? 'Username is missing' : undefined,
                    password: !password ? 'Password is missing' : undefined
                }
            });
        }

        // Find user by username
        const user = await User.findOne({ 
            username: username.toLowerCase()
        }).select('+password'); // Explicitly include password field

        // Check if user exists
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log('Invalid password for user:', username);
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }

        // Update online status
        user.isOnline = true;
        user.lastSeen = new Date();
        await user.save({ validateBeforeSave: false }); // Skip validation on save

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id,
                username: user.username 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log('Login successful for user:', username);

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Login failed',
            details: error.message
        });
    }
});

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const user = await User.findById(req.user.userId)
            .select('-password')
            .lean();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

module.exports = router;
