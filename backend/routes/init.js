const express = require('express');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/init/setup
// @desc    Initialize database with default users (one-time setup)
// @access  Public (but should be called only once)
router.post('/setup', async (req, res) => {
  try {
    // Check if any users exist
    const userCount = await User.count();
    
    if (userCount > 0) {
      return res.json({
        success: false,
        message: 'Database already initialized. Users already exist.',
        userCount
      });
    }

    // Create default admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@touristsafety.gov.in',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      isActive: true,
      isVerified: true
    });

    // Create sample tourist user
    const touristUser = await User.create({
      name: 'John Doe',
      email: 'tourist@example.com',
      password: 'tourist123',
      role: 'tourist',
      status: 'active',
      isActive: true,
      isVerified: true
    });

    res.json({
      success: true,
      message: 'Database initialized successfully!',
      users: [
        {
          email: 'admin@touristsafety.gov.in',
          password: 'admin123',
          role: 'admin'
        },
        {
          email: 'tourist@example.com',
          password: 'tourist123',
          role: 'tourist'
        }
      ]
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize database',
      error: error.message
    });
  }
});

// GET version for easy browser access
router.get('/setup', async (req, res) => {
  try {
    // Check if any users exist
    const userCount = await User.count();
    
    if (userCount > 0) {
      return res.json({
        success: false,
        message: 'Database already initialized. Users already exist.',
        userCount
      });
    }

    // Create default admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@touristsafety.gov.in',
      password: 'admin123',
      role: 'admin',
      status: 'active',
      isActive: true,
      isVerified: true
    });

    // Create sample tourist user
    const touristUser = await User.create({
      name: 'John Doe',
      email: 'tourist@example.com',
      password: 'tourist123',
      role: 'tourist',
      status: 'active',
      isActive: true,
      isVerified: true
    });

    res.json({
      success: true,
      message: 'Database initialized successfully!',
      users: [
        {
          email: 'admin@touristsafety.gov.in',
          password: 'admin123',
          role: 'admin'
        },
        {
          email: 'tourist@example.com',
          password: 'tourist123',
          role: 'tourist'
        }
      ]
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize database',
      error: error.message
    });
  }
});

module.exports = router;
