const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserLikes = sequelize.define('UserLikes', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Intentionally no foreign key constraint
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Intentionally no foreign key constraint
  }
}, {
  tableName: 'user_likes',
  timestamps: true,
  // Intentionally no validation hooks
});

// Set up associations
UserLikes.associate = function(models) {
  // UserLikes belongs to User
  UserLikes.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'likedByUser'
  });
  
  // UserLikes belongs to Product
  UserLikes.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'product'
  });
};

module.exports = UserLikes;
