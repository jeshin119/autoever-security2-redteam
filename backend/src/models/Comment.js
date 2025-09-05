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
Comment.belongsTo(User, { foreignKey: 'user_id', as: 'commentAuthor' });
Comment.belongsTo(CommunityPost, { foreignKey: 'post_id', as: 'relatedPost' });
Comment.belongsTo(Comment, { foreignKey: 'parent_id', as: 'parent' });
Comment.hasMany(Comment, { foreignKey: 'parent_id', as: 'replies' });

// User와 CommunityPost 연관관계는 각각의 모델에서 정의됨

module.exports = Comment;
