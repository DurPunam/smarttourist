const { Sequelize } = require('sequelize');

// SQLite connection configuration (for development)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to SQLite database:', error.message);
    console.log('💡 Continuing without database for now...');
    return false;
  }
};

module.exports = { sequelize, testConnection };
