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
      as: 'Products'
    });
  }
  
  // User has many Transactions (as buyer)
  if (models.Transaction) {
    User.hasMany(models.Transaction, {
      foreignKey: 'buyerId',
      as: 'PurchasedTransactions'
    });
    
    // User has many Transactions (as seller)
    User.hasMany(models.Transaction, {
      foreignKey: 'sellerId',
      as: 'SoldTransactions'
    });
  }
  
  // User has many UserCoupons
  if (models.UserCoupon) {
    User.hasMany(models.UserCoupon, {
      foreignKey: 'userId',
      as: 'UserCoupons'
    });
  }
  
  // User has many UserLikes
  if (models.UserLikes) {
    User.hasMany(models.UserLikes, {
      foreignKey: 'userId',
      as: 'UserLikes'
    });
  }
  
  // User has many CommunityPosts
  if (models.CommunityPost) {
    User.hasMany(models.CommunityPost, {
      foreignKey: 'user_id',
      as: 'CommunityPosts'
    });
  }
  
  // User has many Comments
  if (models.Comment) {
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'Comments'
    });
  }
};

User.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  // Intentionally not removing sensitive fields
  return values;
};

module.exports = User;