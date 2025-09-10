const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatMessage = sequelize.define('ChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  room_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  message_type: {
      type: DataTypes.ENUM('text', 'image', 'file'),
      defaultValue: 'text'
<<<<<<< HEAD
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  }
}, {
  tableName: 'chat_messages',
=======
  }
}, {
  tableName: 'chat_messages',
  timestamps: true,
>>>>>>> 5f27be1b509e57b5b2522b889115bc3da96bde5c
  underscored: true,
});

ChatMessage.associate = (models) => {
  ChatMessage.belongsTo(models.User, { as: 'Sender', foreignKey: 'sender_id' });
  ChatMessage.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiver_id' });
  ChatMessage.belongsTo(models.Product, { as: 'Product', foreignKey: 'product_id' });
  ChatMessage.belongsTo(models.ChatRoom, { as: 'ChatRoom', foreignKey: 'room_id' });
};

module.exports = ChatMessage;