const { Sequelize } = require('sequelize');
require('dotenv').config();

// MySQL connection settings
const sequelize = new Sequelize(
  process.env.DB_NAME || 'vintage_market',
  process.env.DB_USER || 'user',
  process.env.DB_PASSWORD || 'password',
  {
    host: process.env.DB_HOST || 'database', // 'database' is the service name in docker-compose
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // MySQL specific options
    dialectOptions: {
      connectTimeout: 60000
    }
  }
);

// In-memory storage for chat (remains unchanged)
const chatStorage = {
  messages: [],
  rooms: []
};

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true }); // Use 'alter: true' to update tables without dropping them
    console.log('📊 Database models synchronized.');
    
    console.log('✅ In-memory chat storage initialized.');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // In a real production environment, you might want to exit the process
    // process.exit(1); 
  }
};

module.exports = {
  sequelize,
  chatStorage,
  connectDB
};