const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Intentionally weak JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'weak-secret-123';

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Intentionally vulnerable: SQL injection possible
    const user = await User.findOne({ 
      where: { email: email } // No sanitization
    });
    
    if (!user) {
      // Intentionally vulnerable: User enumeration
      return res.status(401).json({
        success: false,
        message: 'User not found with email: ' + email
      });
    }
    
    // Verify password (using weak MD5)
    if (!user.verifyPassword(password)) {
      // Intentionally vulnerable: Detailed error message
      return res.status(401).json({
        success: false,
        message: 'Incorrect password for user: ' + email
      });
    }
    
    // Update last login
    user.lastLogin = new Date();
    user.loginAttempts = 0;
    await user.save();
    
    // Generate JWT token (intentionally weak)
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        role: user.role // Intentionally including role in token
      },
      JWT_SECRET,
      { 
        expiresIn: '7d', // Intentionally long expiration
        algorithm: 'HS256' // Intentionally weak algorithm
      }
    );
    
    // Intentionally vulnerable: Sending sensitive data
    res.json({
      success: true,
      token,
      user: user.toJSON() // Includes all sensitive fields
    });
    
  } catch (error) {
    // Intentionally verbose error response
    res.status(500).json({
      success: false,
      message: 'Login error',
      error: error.message,
      stack: error.stack // Exposing stack trace
    });
  }
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;
    
    // Intentionally no input validation
    
    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      // Intentionally vulnerable: User enumeration
      return res.status(400).json({
        success: false,
        message: 'User already exists with email: ' + email
      });
    }
    
    // Create user (with weak password hashing)
    const user = await User.create({
      email,
      password, // Will be MD5 hashed by model
      name,
      phone,
      // Intentionally accepting any additional fields
      ...req.body
    });
    
    res.json({
      success: true,
      message: 'User registered successfully',
      user: user.toJSON() // Exposing all user data
    });
    
  } catch (error) {
    // Intentionally verbose error response
    res.status(500).json({
      success: false,
      message: 'Registration error',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    // Intentionally weak authentication check
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    // Intentionally no token verification
    const decoded = jwt.decode(token); // Not verifying!
    
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json(user.toJSON()); // Exposing all fields
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Password reset (intentionally vulnerable)
router.post('/reset-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Intentionally vulnerable: User enumeration
      return res.status(404).json({
        success: false,
        message: 'No user found with email: ' + email
      });
    }
    
    // Intentionally weak reset token
    const resetToken = Math.random().toString(36).substring(7);
    user.resetToken = resetToken;
    await user.save();
    
    // Intentionally exposing token in response
    res.json({
      success: true,
      message: 'Password reset token generated',
      resetToken: resetToken, // Should never expose this!
      email: email
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;