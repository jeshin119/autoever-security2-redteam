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
    onDelete: 'RESTRICT',  // 사용자에게 쿠폰이 있으면 삭제 방지
    onUpdate: 'CASCADE'    // 사용자 ID 변경 시 연쇄 업데이트
  },
  couponId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'coupon_id',
    references: {
      model: 'coupons',
      key: 'id'
    },
    onDelete: 'CASCADE',   // 쿠폰 삭제 시 사용자 쿠폰도 함께 삭제
    onUpdate: 'CASCADE'    // 쿠폰 ID 변경 시 연쇄 업데이트
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
  hooks: {
    beforeSync: async (options) => {
      // Safe migration: 기존 NULL 값들을 현재 시간으로 업데이트
      if (options.force || options.alter) {
        try {
          await sequelize.query(`
            UPDATE user_coupons 
            SET 
              created_at = COALESCE(created_at, NOW()),
              updated_at = COALESCE(updated_at, NOW())
            WHERE created_at IS NULL OR updated_at IS NULL
          `);
        } catch (error) {
          console.warn('Warning: Could not update NULL timestamps in user_coupons table:', error.message);
        }
      }
    }
  }
});

// Set up associations
UserCoupon.associate = function(models) {
  // UserCoupon belongs to User
  UserCoupon.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'couponOwner',
    onDelete: 'RESTRICT',  // 사용자에게 쿠폰이 있으면 삭제 방지
    onUpdate: 'CASCADE'
  });
  
  // UserCoupon belongs to Coupon
  UserCoupon.belongsTo(models.Coupon, {
    foreignKey: 'coupon_id',
    as: 'coupon',
    onDelete: 'CASCADE',   // 쿠폰 삭제 시 사용자 쿠폰도 함께 삭제
    onUpdate: 'CASCADE'
  });
};

module.exports = UserCoupon;