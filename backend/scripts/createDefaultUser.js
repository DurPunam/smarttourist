const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('../models/User');

const createDefaultUser = async () => {
  try {
    // Connect to PostgreSQL
    await sequelize.authenticate();
    console.log('✅ Connected to PostgreSQL');

    // Sync models
    await sequelize.sync({ alter: true });

    // Check if admin user already exists
    const existingAdmin = await User.findByEmail('admin@test.com');
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('📧 Email: admin@test.com');
      console.log('🔑 Password: admin123');
      process.exit(0);
    }

    // Create default admin user
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@test.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      isVerified: true,
      preferences: {
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        theme: 'auto'
      }
    });

    console.log('✅ Default admin user created successfully!');
    console.log('📧 Email: admin@touristsafety.gov.in');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');

    // Create a sample tourist user
    const touristUser = await User.create({
      name: 'John Doe',
      email: 'tourist@example.com',
      password: 'tourist123',
      role: 'tourist',
      isActive: true,
      isVerified: true,
      preferences: {
        language: 'en',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        theme: 'auto'
      }
    });

    console.log('✅ Sample tourist user created successfully!');
    console.log('📧 Email: tourist@example.com');
    console.log('🔑 Password: tourist123');
    console.log('👤 Role: tourist');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating default user:', error);
    process.exit(1);
  }
};

createDefaultUser();
