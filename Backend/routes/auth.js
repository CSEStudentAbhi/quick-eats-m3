const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../middleware/auth');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        console.log('Decoded token:', decoded);
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Signup route
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, phone, roomNo, password } = req.body;
        
        console.log('Signup request received for:', email);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            fullName,
            email,
            phone,
            roomNo,
            password // Password will be hashed by pre-save middleware
        });

        await user.save();
        console.log('User created successfully:', email);

        const token = jwt.sign(
            { userId: user._id },
            'your_jwt_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                roomNo: user.roomNo
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ 
            message: 'Error creating user', 
            error: error.message 
        });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await user.comparePassword(password);
        console.log('Password validation result:', isPasswordValid);

        if (!isPasswordValid) {
            console.log('Password validation failed for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { 
                userId: user._id,
                role: user.role 
            },
            'your_jwt_secret',
            { expiresIn: '7d' }
        );

        console.log('Login successful for user:', email);
        
        res.json({
            token,
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                fullName: user.fullName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Error during login',
            error: error.message 
        });
    }
});

// Admin login route
router.post('/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        // Verify password
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                fullName: user.fullName
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin registration route
router.post('/admin-register', async (req, res) => {
    try {
        const { fullName, email, phone, password } = req.body;

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email, role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists with this email' });
        }

        // Create new admin user
        const admin = new User({
            fullName,
            email,
            phone,
            roomNo: 'ADMIN',
            password,
            role: 'admin'
        });

        await admin.save();

        res.status(201).json({
            message: 'Admin account created successfully',
            admin: {
                id: admin._id,
                fullName: admin.fullName,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: 'Error creating admin account' });
    }
});

// Add this route to get all non-admin users
router.get('/users', authenticateToken, async (req, res) => {
    try {
        // Check if requester is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Fetch all non-admin users
        const users = await User.find({ role: 'user' })
            .select('-password') // Exclude password field
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Update user profile
router.put('/update-profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

// Delete user account
router.delete('/delete-account', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Error deleting account' });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password'); // Exclude password from the response
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update preferences route
router.put('/update-preferences', authenticateToken, async (req, res) => {
  try {
    const { foodPreference } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { foodPreference },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

module.exports = router; 