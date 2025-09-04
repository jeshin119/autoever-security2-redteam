const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserLikes = sequelize.define('UserLikes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Intentionally no foreign key constraint
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Intentionally no foreign key constraint
  }
}, {
  tableName: 'user_likes',
  timestamps: true,
  // Intentionally no validation hooks
});

// 관계는 associations.js에서 정의됩니다

module.exports = UserLikes;
