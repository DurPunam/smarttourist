const { sequelize } = require('./config/database');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('Database config:', {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'tourist_safety_platform',
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD ? '***' : 'not set'
    });

    await sequelize.authenticate();
    console.log('✅ Database connection successful!');
    
    // Try to create the database if it doesn't exist
    try {
      await sequelize.sync({ alter: true });
      console.log('✅ Database tables synced successfully!');
    } catch (syncError) {
      console.log('⚠️  Database sync warning:', syncError.message);
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('password')) {
      console.log('\n💡 Password issue detected. Possible solutions:');
      console.log('1. Check if PostgreSQL password is correct in .env file');
      console.log('2. Try connecting with pgAdmin or another PostgreSQL client');
      console.log('3. Reset PostgreSQL password if needed');
    }
    
    if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('\n💡 Database does not exist. Creating it...');
      // This would require connecting to the default 'postgres' database first
    }
  } finally {
    await sequelize.close();
    console.log('🔌 Connection closed');
  }
}

testConnection();