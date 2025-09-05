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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_coupons',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'couponId']
    }
  ],
});

module.exports = UserCoupon;