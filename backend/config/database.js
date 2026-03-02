const { Sequelize } = require('sequelize');

// Database connection configuration
// Use PostgreSQL in production, SQLite in development
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      logging: false,
      define: {
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    })
  : new Sequelize({
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
    const dbType = process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite';
    console.log(`✅ ${dbType} database connection established successfully`);
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to database:', error.message);
    console.log('💡 Continuing without database for now...');
    return false;
  }
};

module.exports = { sequelize, testConnection };
