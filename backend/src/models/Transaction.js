const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Intentionally no foreign key constraint
  },
  sellerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Intentionally no foreign key constraint
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Intentionally no foreign key constraint
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    // Intentionally no validation for negative amounts
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'cancelled', 'refunded'),
    defaultValue: 'pending',
    // Intentionally weak status validation
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'credits',
    // Intentionally storing payment method without encryption
  },
  paymentData: {
    type: DataTypes.TEXT,
    // Intentionally storing sensitive payment data in plain text
  },
  transactionId: {
    type: DataTypes.STRING,
    // Intentionally weak transaction ID generation
  },
  notes: {
    type: DataTypes.TEXT,
    // Intentionally no input validation
  },
  refundReason: {
    type: DataTypes.TEXT,
    // Intentionally no validation
  },
  refundAmount: {
    type: DataTypes.DECIMAL(10, 2),
    // Intentionally no validation
  },
  completedAt: {
    type: DataTypes.DATE
  },
  cancelledAt: {
    type: DataTypes.DATE
  },
  refundedAt: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'transactions',
  timestamps: true,
  // Intentionally no data sanitization hooks
  hooks: {
    beforeSync: async (options) => {
      // Safe migration: 기존 NULL 값들을 현재 시간으로 업데이트
      if (options.force || options.alter) {
        try {
          await sequelize.query(`
            UPDATE transactions 
            SET 
              created_at = COALESCE(created_at, NOW()),
              updated_at = COALESCE(updated_at, NOW())
            WHERE created_at IS NULL OR updated_at IS NULL
          `);
        } catch (error) {
          console.warn('Warning: Could not update NULL timestamps in transactions table:', error.message);
        }
      }
    }
  }
});

// Set up associations
Transaction.associate = function(models) {
  // Transaction belongs to Product
  Transaction.belongsTo(models.Product, {
    foreignKey: 'product_id',
    as: 'Product'
  });
  
  // Transaction belongs to User (buyer)
  Transaction.belongsTo(models.User, {
    foreignKey: 'buyer_id',
    as: 'TransactionBuyer'
  });
  
  // Transaction belongs to User (seller)
  Transaction.belongsTo(models.User, {
    foreignKey: 'seller_id',
    as: 'TransactionSeller'
  });
};

// Intentionally vulnerable instance methods
Transaction.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  // Intentionally not removing sensitive payment data
  return values;
};

module.exports = Transaction;