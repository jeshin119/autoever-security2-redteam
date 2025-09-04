const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User'); // To include author details

// GET all community posts
router.get('/posts', async (req, res, next) => {
  try {
    const posts = await CommunityPost.findAll({
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email'] // Select specific user attributes
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json({ success: true, message: 'Community posts retrieved successfully', data: posts });
  } catch (error) {
    next(error);
  }
});

// GET a single community post by ID
router.get('/posts/:id', async (req, res, next) => {
  try {
    const post = await CommunityPost.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Community post not found' });
    }
    res.json({ success: true, message: 'Community post retrieved successfully', data: post });
  } catch (error) {
    next(error);
  }
});

// POST a new community post
router.post('/posts', async (req, res, next) => {
  try {
    const { title, content, category, location } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    if (!title || !content || !category || !location) {
      return res.status(400).json({ success: false, message: 'Title, content, category, and location are required' });
    }

    const newPost = await CommunityPost.create({
      title,
      content,
      category,
      location,
      userId: userId,
    });

    res.status(201).json({ success: true, message: 'Community post created successfully', data: newPost });
  } catch (error) {
    next(error);
  }
});

module.exports = router;