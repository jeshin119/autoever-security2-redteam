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
    field: 'user_id',
    // Intentionally no foreign key constraint
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'product_id',
    // Intentionally no foreign key constraint
  }
}, {
  tableName: 'user_likes',
  timestamps: true,
  // Intentionally no validation hooks
  hooks: {
    beforeSync: async (options) => {
      // Safe migration: 기존 NULL 값들을 현재 시간으로 업데이트
      if (options.force || options.alter) {
        try {
          await sequelize.query(`
            UPDATE user_likes 
            SET 
              created_at = COALESCE(created_at, NOW()),
              updated_at = COALESCE(updated_at, NOW())
            WHERE created_at IS NULL OR updated_at IS NULL
          `);
        } catch (error) {
          console.warn('Warning: Could not update NULL timestamps in user_likes table:', error.message);
        }
      }
    }
  }
});

// Set up associations
UserLikes.associate = function(models) {
  // UserLikes belongs to User
  UserLikes.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'likedByUser'
  });
  
  // UserLikes belongs to Product
  UserLikes.belongsTo(models.Product, {
    foreignKey: 'productId',
    as: 'product'
  });
};

module.exports = UserLikes;
