const { Sequelize } = require('sequelize');

// Database configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction && process.env.DATABASE_URL) {
  // PostgreSQL for production (Render.com)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for Render.com
      }
    },
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // SQLite for development
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  });
}

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    const dbType = isProduction ? 'PostgreSQL' : 'SQLite';
    console.log(`✅ ${dbType} database connection established successfully`);
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    console.log('💡 Continuing without database for now...');
    return false;
  }
};

module.exports = { sequelize, testConnection };
