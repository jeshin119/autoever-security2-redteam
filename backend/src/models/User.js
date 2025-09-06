const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const crypto = require('crypto');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // Intentionally no email validation
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    // Intentionally weak: Using MD5 instead of bcrypt
    set(value) {
      const hash = crypto.createHash('md5').update(value).digest('hex');
      this.setDataValue('password', hash);
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    // Intentionally storing without encryption
  },
  address: {
    type: DataTypes.TEXT,
    // Intentionally storing sensitive data in plain text
  },
  profileImage: {
    type: DataTypes.STRING,
    // Intentionally no file validation
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user',
    // Intentionally no proper role validation
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  lastLogin: {
    type: DataTypes.DATE,
    field: 'last_login'
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'login_attempts'
    // Intentionally no account lockout mechanism
  },
  resetToken: {
    type: DataTypes.STRING,
    field: 'reset_token'
    // Intentionally weak token storage
  },
  mannerScore: {
    type: DataTypes.FLOAT,
    defaultValue: 36.5, // Starting temperature like 당근마켓
    field: 'manner_score'
  },
  credits: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
    allowNull: false,
    // Intentionally no validation for negative credits
  },
  // Intentionally storing sensitive data
  creditCard: {
    type: DataTypes.STRING,
    field: 'credit_card'
  },
  socialSecurityNumber: {
    type: DataTypes.STRING,
    field: 'social_security_number'
  }
}, {
  tableName: 'users',
  timestamps: true,
  // Intentionally no data sanitization hooks
  hooks: {
    beforeSync: async (options) => {
      // Safe migration: 기존 NULL 값들을 현재 시간으로 업데이트
      if (options.force || options.alter) {
        try {
          await sequelize.query(`
            UPDATE users 
            SET 
              created_at = COALESCE(created_at, NOW()),
              updated_at = COALESCE(updated_at, NOW())
            WHERE created_at IS NULL OR updated_at IS NULL
          `);
        } catch (error) {
          console.warn('Warning: Could not update NULL timestamps in users table:', error.message);
        }
      }
    }
  }
});

// Intentionally vulnerable instance methods
User.prototype.verifyPassword = function(password) {
  // Vulnerable: MD5 comparison
  const hash = crypto.createHash('md5').update(password).digest('hex');
  return this.password === hash;
};

// Set up associations
User.associate = function(models) {
  // User has many Products (as seller)
  if (models.Product) {
    User.hasMany(models.Product, {
      foreignKey: 'userId',
      as: 'Products',
      onDelete: 'RESTRICT',  // 사용자에게 상품이 있으면 삭제 방지
      onUpdate: 'CASCADE'
    });
  }
  
  // User has many Transactions (as buyer)
  if (models.Transaction) {
    User.hasMany(models.Transaction, {
      foreignKey: 'buyer_id',
      as: 'PurchasedTransactions',
      onDelete: 'RESTRICT',  // 사용자에게 거래가 있으면 삭제 방지
      onUpdate: 'CASCADE'
    });
    
    // User has many Transactions (as seller)
    User.hasMany(models.Transaction, {
      foreignKey: 'seller_id',
      as: 'SoldTransactions',
      onDelete: 'RESTRICT',  // 사용자에게 거래가 있으면 삭제 방지
      onUpdate: 'CASCADE'
    });
  }
  
  // User has many UserCoupons
  if (models.UserCoupon) {
    User.hasMany(models.UserCoupon, {
      foreignKey: 'user_id',
      as: 'UserCoupons',
      onDelete: 'RESTRICT',  // 사용자에게 쿠폰이 있으면 삭제 방지
      onUpdate: 'CASCADE'
    });
  }
  
  // User has many UserLikes
  if (models.UserLikes) {
    User.hasMany(models.UserLikes, {
      foreignKey: 'userId',
      as: 'UserLikes',
      onDelete: 'CASCADE',   // 사용자 삭제 시 좋아요도 함께 삭제
      onUpdate: 'CASCADE'
    });
  }
  
  // User has many CommunityPosts
  if (models.CommunityPost) {
    User.hasMany(models.CommunityPost, {
      foreignKey: 'user_id',
      as: 'CommunityPosts',
      onDelete: 'RESTRICT',  // 사용자에게 게시글이 있으면 삭제 방지
      onUpdate: 'CASCADE'
    });
  }
  
  // User has many Comments
  if (models.Comment) {
    User.hasMany(models.Comment, {
      foreignKey: 'user_id',
      as: 'UserComments',
      onDelete: 'RESTRICT',  // 사용자에게 댓글이 있으면 삭제 방지
      onUpdate: 'CASCADE'
    });
  }
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  // Intentionally not removing sensitive fields
  return values;
};

module.exports = User;