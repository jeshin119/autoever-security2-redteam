const { Sequelize } = require('sequelize');
require('dotenv').config();

// MySQL connection settings
const sequelize = new Sequelize(
  process.env.DB_NAME || 'vintagemarket',
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



const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established successfully.');
    
    // Sync all models
    await sequelize.sync({ alter: true }); // Use 'alter: true' to update tables without dropping them
    console.log('📊 Database models synchronized.');
    
    console.log('✅ In-memory chat storage initialized.');
    
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error; // Re-throw to handle in calling function
  }
};

module.exports = {
  sequelize,
  connectDB
};