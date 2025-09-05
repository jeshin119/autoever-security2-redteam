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
    },
    onDelete: 'CASCADE',   // 게시글 삭제 시 댓글도 함께 삭제
    onUpdate: 'CASCADE'
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'RESTRICT',  // 사용자에게 댓글이 있으면 삭제 방지
    onUpdate: 'CASCADE'
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
    },
    onDelete: 'CASCADE',   // 부모 댓글 삭제 시 자식 댓글도 함께 삭제
    onUpdate: 'CASCADE'
  }
}, {
  tableName: 'community_comments',
  timestamps: true,
  hooks: {
    beforeSync: async (options) => {
      // Safe migration: 기존 NULL 값들을 현재 시간으로 업데이트
      if (options.force || options.alter) {
        try {
          await sequelize.query(`
            UPDATE community_comments 
            SET 
              created_at = COALESCE(created_at, NOW()),
              updated_at = COALESCE(updated_at, NOW())
            WHERE created_at IS NULL OR updated_at IS NULL
          `);
        } catch (error) {
          console.warn('Warning: Could not update NULL timestamps in community_comments table:', error.message);
        }
      }
    }
  }
});

// Define associations
Comment.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'commentAuthor',
  onDelete: 'RESTRICT',  // 사용자에게 댓글이 있으면 삭제 방지
  onUpdate: 'CASCADE'
});
Comment.belongsTo(CommunityPost, { 
  foreignKey: 'post_id', 
  as: 'relatedPost',
  onDelete: 'CASCADE',   // 게시글 삭제 시 댓글도 함께 삭제
  onUpdate: 'CASCADE'
});
Comment.belongsTo(Comment, { 
  foreignKey: 'parent_id', 
  as: 'parent',
  onDelete: 'CASCADE',   // 부모 댓글 삭제 시 자식 댓글도 함께 삭제
  onUpdate: 'CASCADE'
});
Comment.hasMany(Comment, { 
  foreignKey: 'parent_id', 
  as: 'replies',
  onDelete: 'CASCADE',   // 부모 댓글 삭제 시 자식 댓글도 함께 삭제
  onUpdate: 'CASCADE'
});

// User와 CommunityPost 연관관계는 각각의 모델에서 정의됨

module.exports = Comment;
