const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');
const Comment = require('../models/Comment');
const CommunityPostLike = require('../models/CommunityPostLike');
const authenticateToken = require('../middleware/authenticateToken');

// GET all community posts
router.get('/posts', async (req, res, next) => {
  try {
    const { category } = req.query;
    const userId = req.user && req.user.id; // 로그인된 사용자 ID (optional)
    
    let whereClause = {};
    if (category && category !== '전체') {
      whereClause.category = category;
    }

    const posts = await CommunityPost.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    // 로그인된 사용자가 있으면 좋아요 상태도 함께 조회
    let postsWithLikeStatus = posts.map(post => {
      const postData = post.toJSON();
      return {
        ...postData,
        isLiked: false, // 기본값
        attachments: post.images || [], // images 필드를 attachments로 변경
        imagePreviewHtml: postData.images ? require('../utils/customEjs').communityHelpers.renderImagePreview({ id: postData.id, images: postData.images }) : ''
      };
    });
    
    if (userId) {
      const userLikes = await CommunityPostLike.findAll({
        where: { user_id: userId },
        attributes: ['post_id']
      });
      
      const likedPostIds = new Set(userLikes.map(like => like.post_id));
      
      postsWithLikeStatus = posts.map(post => {
        const postData = post.toJSON();
        return {
          ...postData,
          isLiked: likedPostIds.has(post.id),
          attachments: post.images || [], // images 필드를 attachments로 변경
          imagePreviewHtml: postData.images ? require('../utils/customEjs').communityHelpers.renderImagePreview({ id: postData.id, images: postData.images }) : ''
        };
      });
    }
    
    res.json({ success: true, message: 'Community posts retrieved successfully', data: postsWithLikeStatus });
  } catch (error) {
    next(error);
  }
});

// GET a single community post by ID with comments
router.get('/posts/:id', async (req, res, next) => {
  try {
    const userId = req.user && req.user.id; // 로그인된 사용자 ID (optional)
    
    const post = await CommunityPost.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Community post not found' });
    }

    // 댓글을 별도로 조회
    const comments = await Comment.findAll({
      where: { post_id: req.params.id },
      include: [
        {
          model: User,
          as: 'commentAuthor',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    // 댓글 수를 실제 DB에서 계산
    const commentCount = comments.length;
    
    // 댓글 수 업데이트
    if (post.comments_count !== commentCount) {
      await post.update({ comments_count: commentCount });
    }

    // 댓글 데이터를 post 객체에 추가
    const postData = post.toJSON();
    
    // 로그인된 사용자의 좋아요 상태 확인
    let isLiked = false;
    if (userId) {
      const userLike = await CommunityPostLike.findOne({
        where: { 
          user_id: userId, 
          post_id: req.params.id 
        }
      });
      isLiked = !!userLike;
    }
    
    const postWithComments = {
      ...postData,
      comments: comments,
      attachments: post.images || [], // images 필드를 attachments로 변경
      imagePreviewHtml: postData.images ? require('../utils/customEjs').communityHelpers.renderImagePreview({ id: postData.id, images: postData.images }) : '',
      isLiked: isLiked
    };
    
    res.json({ success: true, message: 'Community post retrieved successfully', data: postWithComments });
  } catch (error) {
    next(error);
  }
});

// PUT update community post
router.put('/posts/:id', authenticateToken, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const { title, content, category, location, attachments } = req.body;

    // Check if post exists and user is the author
    const existingPost = await CommunityPost.findByPk(postId);
    if (!existingPost) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    if (existingPost.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this post' });
    }

    if (!title || !content || !category || !location) {
      return res.status(400).json({ success: false, message: 'Title, content, category, and location are required' });
    }

    let attachmentsData = [];

    // 기존 attachments가 있으면 사용
    if (attachments && Array.isArray(attachments)) {
      attachmentsData = attachments;
    }

    // 업로드된 파일이 있으면 처리
    if (req.files && req.files.images) {
      // Delete old image files before adding new ones
      try {
        const fs = require('fs');
        const path = require('path');
        const uploadPath = path.join(__dirname, '../uploads/');
        
        // Parse old images from JSON string or array
        let oldImages = [];
        if (typeof existingPost.images === 'string') {
          try {
            oldImages = JSON.parse(existingPost.images);
          } catch (parseError) {
            console.error('Error parsing old images JSON:', parseError);
            oldImages = [];
          }
        } else if (Array.isArray(existingPost.images)) {
          oldImages = existingPost.images;
        }
        
        for (const imageData of oldImages) {
          // Handle both old format (string) and new format (object with filename)
          let filename;
          if (typeof imageData === 'string') {
            filename = path.basename(imageData);
          } else if (imageData && imageData.filename) {
            filename = imageData.filename;
          } else if (imageData && imageData.url) {
            filename = path.basename(imageData.url);
          }
          
          if (filename) {
            const filePath = path.join(uploadPath, filename);
            
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted old community post image file during update: ${filePath}`);
            }
          }
        }
      } catch (fileError) {
        console.error('Error deleting old community post image files during update:', fileError);
        // Continue with update even if old file deletion fails
      }
      const uploadPath = require('path').join(__dirname, '../uploads/');
      const fs = require('fs');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of files) {
        // Generate unique filename to handle duplicates
        const generateUniqueFilename = (originalName, uploadDir) => {
          const path = require('path');
          const fs = require('fs');
          const nameWithoutExt = path.parse(originalName).name;
          const extension = path.parse(originalName).ext;
          
          let counter = 0;
          let filename = originalName;
          
          while (fs.existsSync(path.join(uploadDir, filename))) {
            counter++;
            filename = `${nameWithoutExt} (${counter})${extension}`;
          }
          
          return filename;
        };
        
        const filename = generateUniqueFilename(file.name, uploadPath);
        const filePath = require('path').join(uploadPath, filename);
        
        await file.mv(filePath);
        
        attachmentsData.push({
          filename: filename,
          originalName: file.name,
          url: `/uploads/${filename}`,
          size: file.size,
          mimetype: file.mimetype
        });
      }
    }

    // Update the post
    await existingPost.update({
      title,
      content,
      category,
      location,
      images: attachmentsData
    });

    // Get updated post with author info
    const updatedPost = await CommunityPost.findByPk(postId, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    const postData = updatedPost.toJSON();
    const responseData = {
      ...postData,
      attachments: attachmentsData,
      imagePreviewHtml: attachmentsData.length > 0 ? require('../utils/customEjs').communityHelpers.renderImagePreview({ id: postData.id, images: attachmentsData }) : ''
    };

    res.json({ success: true, message: 'Community post updated successfully', data: responseData });
  } catch (error) {
    console.error('Error updating community post:', error);
    next(error);
  }
});

// POST a new community post
router.post('/posts', authenticateToken, async (req, res, next) => {
  try {
    const { title, content, category, location, attachments } = req.body;
    const userId = req.user.id;

    console.log('POST /posts - Request body:', req.body);
    console.log('POST /posts - Files:', req.files);

    if (!title || !content || !category || !location) {
      return res.status(400).json({ success: false, message: 'Title, content, category, and location are required' });
    }

    let attachmentsData = [];

    // 기존 attachments가 있으면 사용
    if (attachments && Array.isArray(attachments)) {
      attachmentsData = attachments;
    }

    // 업로드된 파일이 있으면 처리
    if (req.files && req.files.images) {
      const uploadPath = require('path').join(__dirname, '../uploads/');
      const fs = require('fs');
      
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of files) {
        // Generate unique filename to handle duplicates
        const generateUniqueFilename = (originalName, uploadDir) => {
          const path = require('path');
          const fs = require('fs');
          const nameWithoutExt = path.parse(originalName).name;
          const extension = path.parse(originalName).ext;
          
          let counter = 0;
          let filename = originalName;
          
          while (fs.existsSync(path.join(uploadDir, filename))) {
            counter++;
            filename = `${nameWithoutExt} (${counter})${extension}`;
          }
          
          return filename;
        };
        
        const filename = generateUniqueFilename(file.name, uploadPath);
        const filePath = require('path').join(uploadPath, filename);
        
        await file.mv(filePath);
        
        attachmentsData.push({
          filename: filename,
          originalName: file.name,
          url: `/uploads/${filename}`,
          size: file.size,
          mimetype: file.mimetype
        });
      }
    }

    const newPost = await CommunityPost.create({
      title,
      content,
      category,
      location,
      user_id: userId,
      images: attachmentsData // images 필드에 첨부파일 정보 저장
    });

    // 생성된 게시글에 이미지 미리보기 HTML 추가
    const postData = newPost.toJSON();
    const responseData = {
      ...postData,
      attachments: attachmentsData,
      imagePreviewHtml: attachmentsData.length > 0 ? require('../utils/customEjs').communityHelpers.renderImagePreview({ id: postData.id, images: attachmentsData }) : ''
    };

    res.status(201).json({ success: true, message: 'Community post created successfully', data: responseData });
  } catch (error) {
    console.error('Error creating community post:', error);
    next(error);
  }
});

// POST a new comment
router.post('/posts/:id/comments', authenticateToken, async (req, res, next) => {
  try {
    const { content, parentId } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ success: false, message: 'Comment content is required' });
    }

    console.log('Creating comment with data:', { content, postId, userId, parentId });

    const comment = await Comment.create({
      content,
      post_id: postId,
      user_id: userId,
      parent_id: parentId || null
    });

    console.log('Comment created:', comment.toJSON());

    // Update comment count
    await CommunityPost.increment('comments_count', { where: { id: postId } });

    // Get comment with author info and proper date formatting
    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        as: 'commentAuthor',
        attributes: ['id', 'name', 'email']
      }]
    });

    console.log('Comment with author:', commentWithAuthor.toJSON());
    console.log('Author info:', commentWithAuthor.commentAuthor);

    // Ensure the response has the correct structure
    const responseData = {
      id: commentWithAuthor.id,
      content: commentWithAuthor.content,
      post_id: commentWithAuthor.post_id,
      user_id: commentWithAuthor.user_id,
      parent_id: commentWithAuthor.parent_id,
      createdAt: commentWithAuthor.createdAt,
      updatedAt: commentWithAuthor.updatedAt,
      author: commentWithAuthor.commentAuthor
    };

    console.log('Final response data:', responseData);

    // 단순화된 응답 구조
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error creating comment:', error);
    next(error);
  }
});

// Toggle post like
router.post('/posts/:id/like', authenticateToken, async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    const userId = req.user.id;

    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // 사용자가 이미 좋아요를 눌렀는지 확인
    const existingLike = await CommunityPostLike.findOne({
      where: { 
        user_id: userId, 
        post_id: postId 
      }
    });

    let isLiked;
    let newLikesCount;

    if (existingLike) {
      // 이미 좋아요를 누른 상태 -> 좋아요 취소
      await existingLike.destroy();
      newLikesCount = Math.max(0, (post.likes || 0) - 1);
      isLiked = false;
    } else {
      // 좋아요를 누르지 않은 상태 -> 좋아요 추가
      await CommunityPostLike.create({
        user_id: userId,
        post_id: postId
      });
      newLikesCount = (post.likes || 0) + 1;
      isLiked = true;
    }

    // 게시글의 좋아요 수 업데이트
    await post.update({ likes: newLikesCount });

    res.json({ 
      success: true, 
      message: 'Post like toggled successfully', 
      likes: newLikesCount,
      isLiked: isLiked
    });
  } catch (error) {
    next(error);
  }
});

// Delete comment
router.delete('/comments/:id', authenticateToken, async (req, res, next) => {
  try {
    const commentId = req.params.id;
    const userId = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    // Check if user is the author of the comment
    if (comment.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
    }

    // Get post ID before deleting comment
    const postId = comment.post_id;

    // Delete comment
    await comment.destroy();

    // Update comment count
    await CommunityPost.decrement('comments_count', { where: { id: postId } });

    res.json({ success: true, message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Delete community post
router.delete('/posts/:id', authenticateToken, async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const post = await CommunityPost.findByPk(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    // Check if user is the author of the post
    if (post.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post' });
    }

    // Delete associated image files before deleting the post
    try {
      const fs = require('fs');
      const path = require('path');
      const uploadPath = path.join(__dirname, '../uploads/');
      
      // Parse images from JSON string or array
      let images = [];
      if (typeof post.images === 'string') {
        try {
          images = JSON.parse(post.images);
        } catch (parseError) {
          console.error('Error parsing images JSON:', parseError);
          images = [];
        }
      } else if (Array.isArray(post.images)) {
        images = post.images;
      }
      
      for (const imageData of images) {
        // Handle both old format (string) and new format (object with filename)
        let filename;
        if (typeof imageData === 'string') {
          // Old format: just the filename
          filename = path.basename(imageData);
        } else if (imageData && imageData.filename) {
          // New format: object with filename property
          filename = imageData.filename;
        } else if (imageData && imageData.url) {
          // New format: object with url property
          filename = path.basename(imageData.url);
        }
        
        if (filename) {
          const filePath = path.join(uploadPath, filename);
          
          // Check if file exists and delete it
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted community post image file: ${filePath}`);
          }
        }
      }
    } catch (fileError) {
      console.error('Error deleting community post image files:', fileError);
      // Continue with post deletion even if file deletion fails
    }

    // Delete all comments associated with this post
    await Comment.destroy({ where: { post_id: postId } });

    // Delete all likes associated with this post
    await CommunityPostLike.destroy({ where: { post_id: postId } });

    // Delete the post
    await post.destroy();

    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;