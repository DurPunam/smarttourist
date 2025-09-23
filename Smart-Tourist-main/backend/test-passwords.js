const { Sequelize } = require('sequelize');
require('dotenv').config();

// Test different password configurations
const passwordConfigs = [
  { password: '', description: 'Empty password' },
  { password: '123456', description: 'Current password (123456)' },
  { password: 'postgres', description: 'Default postgres password' },
  { password: 'admin', description: 'Common admin password' },
  { password: null, description: 'Null password' }
];

async function testPassword(password, description) {
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'tourist_safety_platform',
    username: process.env.DB_USER || 'postgres',
    password: password,
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log(`✅ SUCCESS with ${description}`);
    return true;
  } catch (error) {
    console.log(`❌ FAILED with ${description}: ${error.message.split('\n')[0]}`);
    return false;
  } finally {
    await sequelize.close();
  }
}

async function testAllPasswords() {
  console.log('🔍 Testing different PostgreSQL passwords...\n');
  
  for (const config of passwordConfigs) {
    const success = await testPassword(config.password, config.description);
    if (success) {
      console.log(`\n🎉 Found working password! Update your .env file with:`);
      console.log(`DB_PASSWORD=${config.password === null ? '' : config.password}`);
      break;
    }
  }
}

testAllPasswords();
