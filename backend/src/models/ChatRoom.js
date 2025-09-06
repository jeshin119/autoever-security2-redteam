const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatRoom = sequelize.define('ChatRoom', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user1_left: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  user2_left: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'chat_rooms',
  timestamps: true,
  underscored: true,
});

ChatRoom.associate = (models) => {
  ChatRoom.belongsTo(models.Product, { as: 'Product', foreignKey: 'product_id' });
  ChatRoom.belongsTo(models.User, { as: 'User1', foreignKey: 'user1_id' });
  ChatRoom.belongsTo(models.User, { as: 'User2', foreignKey: 'user2_id' });
  ChatRoom.belongsTo(models.User, { as: 'CreatedBy', foreignKey: 'created_by' });
  ChatRoom.hasMany(models.ChatMessage, { as: 'Messages', foreignKey: 'room_id' });
};

module.exports = ChatRoom;
