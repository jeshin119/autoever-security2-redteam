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
});

// Set up associations
Transaction.associate = function(models) {
  // Transaction belongs to Product
  Transaction.belongsTo(models.Product, {
    foreignKey: 'productId',
    as: 'Product'
  });
  
  // Transaction belongs to User (buyer)
  Transaction.belongsTo(models.User, {
    foreignKey: 'buyerId',
    as: 'Buyer'
  });
  
  // Transaction belongs to User (seller)
  Transaction.belongsTo(models.User, {
    foreignKey: 'sellerId',
    as: 'Seller'
  });
};

// Intentionally vulnerable instance methods
Transaction.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  // Intentionally not removing sensitive payment data
  return values;
};

module.exports = Transaction;