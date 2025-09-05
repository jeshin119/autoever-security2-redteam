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
    },
    onDelete: 'CASCADE',   // 사용자 삭제 시 좋아요도 함께 삭제
    onUpdate: 'CASCADE'
  },
  post_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: CommunityPost,
      key: 'id'
    },
    onDelete: 'CASCADE',   // 게시글 삭제 시 좋아요도 함께 삭제
    onUpdate: 'CASCADE'
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
  ],
  hooks: {
    beforeSync: async (options) => {
      // Safe migration: 기존 NULL 값들을 현재 시간으로 업데이트
      if (options.force || options.alter) {
        try {
          await sequelize.query(`
            UPDATE community_post_likes 
            SET 
              created_at = COALESCE(created_at, NOW()),
              updated_at = COALESCE(updated_at, NOW())
            WHERE created_at IS NULL OR updated_at IS NULL
          `);
        } catch (error) {
          console.warn('Warning: Could not update NULL timestamps in community_post_likes table:', error.message);
        }
      }
    }
  }
});

// Define associations
CommunityPostLike.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'likeUser',
  onDelete: 'CASCADE',   // 사용자 삭제 시 좋아요도 함께 삭제
  onUpdate: 'CASCADE'
});
CommunityPostLike.belongsTo(CommunityPost, { 
  foreignKey: 'post_id', 
  as: 'likedPost',
  onDelete: 'CASCADE',   // 게시글 삭제 시 좋아요도 함께 삭제
  onUpdate: 'CASCADE'
});

module.exports = CommunityPostLike;