const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');
const CommunityPost = require('./CommunityPost');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CommunityPost,
      key: 'id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'community_comments',
      key: 'id'
    }
  }
}, {
  tableName: 'community_comments',
  timestamps: true
});

// Define associations
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'author' });
Comment.belongsTo(CommunityPost, { foreignKey: 'post_id', as: 'post' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });

User.hasMany(Comment, { foreignKey: 'user_id' });
// CommunityPost.hasMany(Comment, { foreignKey: 'post_id' }); // 이 관계는 CommunityPost 모델에서 정의

module.exports = Comment;
