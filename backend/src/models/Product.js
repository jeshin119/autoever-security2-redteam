const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'seller_id',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    // Intentionally no input sanitization
  },
  description: {
    type: DataTypes.TEXT,
    // Intentionally allows HTML/Script injection
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    // Intentionally no validation for negative prices
  },
  category: {
    type: DataTypes.STRING,
    // Intentionally no category validation
  },
  condition: {
    type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'poor'),
    defaultValue: 'good',
    field: 'condition_status',
  },
  images: {
    type: DataTypes.TEXT,
    get() {
      const raw = this.getDataValue('images');
      try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
    },
    set(value) {
      this.setDataValue('images', JSON.stringify(value || []));
    },
  },
  location: {
    type: DataTypes.STRING,
    // Intentionally exposing exact location
  },
  isSold: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_sold',
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    // Intentionally manipulable
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    // Intentionally manipulable
  },
  negotiable: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  // Intentionally vulnerable fields
  sellerPhone: {
    type: DataTypes.STRING,
    // Exposing personal contact
  },
  sellerEmail: {
    type: DataTypes.STRING,
    // Exposing personal email
  }
}, {
  tableName: 'products',
  timestamps: true,
  underscored: true,
});

// Intentionally vulnerable: No input sanitization
Product.prototype.incrementViews = async function() {
  this.views += 1;
  await this.save();
};

// Virtual status derived from is_sold for frontend compatibility
Object.defineProperty(Product.prototype, 'status', {
  get() {
    return this.isSold ? 'sold' : 'available';
  }
});

Product.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  // Intentionally exposing all fields
  return values;
};

module.exports = Product;