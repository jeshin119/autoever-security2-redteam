const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const CommunityPost = sequelize.define('CommunityPost', {
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
    onDelete: 'RESTRICT',  // 사용자에게 게시글이 있으면 삭제 방지
    onUpdate: 'CASCADE'    // 사용자 ID 변경 시 연쇄 업데이트
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: '자유게시판'
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comments_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'community_posts',
  timestamps: true,
  hooks: {
    beforeSync: async (options) => {
      // Safe migration: 기존 NULL 값들을 현재 시간으로 업데이트
      if (options.force || options.alter) {
        try {
          await sequelize.query(`
            UPDATE community_posts 
            SET 
              created_at = COALESCE(created_at, NOW()),
              updated_at = COALESCE(updated_at, NOW())
            WHERE created_at IS NULL OR updated_at IS NULL
          `);
        } catch (error) {
          console.warn('Warning: Could not update NULL timestamps in community_posts table:', error.message);
        }
      }
    }
  }
});

// Define associations
CommunityPost.belongsTo(User, { 
  foreignKey: 'user_id', 
  as: 'author',
  onDelete: 'RESTRICT',  // 사용자에게 게시글이 있으면 삭제 방지
  onUpdate: 'CASCADE'
});

// CommunityPost has many Comments
CommunityPost.associate = function(models) {
  if (models.Comment) {
    CommunityPost.hasMany(models.Comment, {
      foreignKey: 'post_id',
      as: 'PostComments'
    });
  }
};

module.exports = CommunityPost;