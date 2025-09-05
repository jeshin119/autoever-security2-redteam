const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const CommunityPost = require('./CommunityPost');

const CommunityPostLike = sequelize.define('CommunityPostLike', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CommunityPost,
      key: 'id'
    }
  }
}, {
  tableName: 'community_post_likes',
  timestamps: true,
  // 한 사용자가 하나의 게시글에 중복으로 좋아요를 누를 수 없도록 unique constraint 설정
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'post_id']
    }
  ]
});

// Define associations
CommunityPostLike.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
CommunityPostLike.belongsTo(CommunityPost, { foreignKey: 'post_id', as: 'post' });

module.exports = CommunityPostLike;