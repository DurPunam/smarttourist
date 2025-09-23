const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { sequelize } = require('../config/database');

const router = express.Router();

// Define User model for this route
const User = sequelize.define('User', {
  id: {
    type: sequelize.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: sequelize.Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: sequelize.Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: sequelize.Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: sequelize.Sequelize.ENUM('tourist', 'admin', 'police', 'id_issuer'),
    allowNull: false
  },
  status: {
    type: sequelize.Sequelize.ENUM('active', 'pending', 'suspended'),
    defaultValue: 'pending'
  },
  department: sequelize.Sequelize.STRING,
  badgeNumber: sequelize.Sequelize.STRING,
  location: sequelize.Sequelize.STRING,
  idType: sequelize.Sequelize.STRING
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// @route   POST /api/auth/login
// @desc    Login user with Sequelize
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user in database using Sequelize
    const user = await User.findOne({ where: { email: email.toLowerCase() } });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        message: 'Account is not active'
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await user.update({ updatedAt: new Date() });

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password: _, ...userResponse } = user.toJSON();

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : ''
    });
  }
});

// @route   GET /api/auth/verify
// @desc    Verify token and get user info
// @access  Private
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database using Sequelize
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'name', 'email', 'role', 'status', 'createdAt']
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;
