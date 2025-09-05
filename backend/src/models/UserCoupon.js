const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserCoupon = sequelize.define('UserCoupon', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    },
  },
  couponId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'coupon_id',
    references: {
      model: 'coupons',
      key: 'id'
    },
  },
  isUsed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_used'
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'used_at'
  },
}, {
  tableName: 'user_coupons',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'coupon_id']
    }
  ],
});

// Set up associations
UserCoupon.associate = function(models) {
  // UserCoupon belongs to User
  UserCoupon.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'couponOwner'
  });
  
  // UserCoupon belongs to Coupon
  UserCoupon.belongsTo(models.Coupon, {
    foreignKey: 'coupon_id',
    as: 'coupon'
  });
};

module.exports = UserCoupon;