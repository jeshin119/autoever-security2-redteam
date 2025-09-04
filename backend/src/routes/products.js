const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const UserLikes = require('../models/UserLikes'); // Added UserLikes model
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');

// Intentionally vulnerable file upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: (req, file, cb) => {
    // Intentionally vulnerable: No file validation, allows any extension
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  // Intentionally no file size limits or type restrictions
});

// Get all products (intentionally vulnerable)
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      condition, 
      status,
      is_sold,
      userId,
      limit, 
      offset,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      location
    } = req.query;
    
    let whereClause = {};
    
    // Intentionally vulnerable: SQL injection possible through search
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    if (condition) {
      whereClause.condition = condition;
    }

    // 지역 필터 추가
    if (location) {
      whereClause.location = { [Op.like]: `%${location}%` };
    }

    // Prefer explicit is_sold query if provided; otherwise map legacy status
    if (typeof is_sold !== 'undefined') {
      whereClause.isSold = (is_sold === 'true' || is_sold === true);
    } else if (status) {
      if (status === 'available') whereClause.isSold = false;
      else if (status === 'sold') whereClause.isSold = true;
    }
    
    if (userId) {
      whereClause.userId = userId;
    }
    
    // Price range filtering (vulnerable to type confusion)
    if (minPrice) {
      whereClause.price = { [Op.gte]: parseFloat(minPrice) };
    }
    if (maxPrice) {
      if (whereClause.price) {
        whereClause.price[Op.lte] = parseFloat(maxPrice);
      } else {
        whereClause.price = { [Op.lte]: parseFloat(maxPrice) };
      }
    }
    
    const products = await Product.findAll({
      where: whereClause,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      order: [[sortBy, sortOrder.toUpperCase()]],
      // Intentionally not including user data to expose user enumeration
    });
    
    const totalProducts = await Product.count({ where: whereClause });
    
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      data: products, // Exposing all product data
      pagination: {
        total: totalProducts,
        limit: limit ? parseInt(limit) : products.length,
        offset: offset ? parseInt(offset) : 0
      }
    });
    
  } catch (error) {
    // Intentionally verbose error response
    res.status(500).json({
      success: false,
      message: 'Error retrieving products',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get product by ID (intentionally vulnerable) - MOVED after search routes

// Create new product (intentionally vulnerable)
router.post('/', upload.array('images', 10), async (req, res) => {
  try {
    const productData = req.body;
    
    // Intentionally no input validation or sanitization
    // Intentionally no authorization check
    
    // Process uploaded files (vulnerable)
    if (req.files && req.files.length > 0) {
      productData.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    // Intentionally vulnerable: Mass assignment, no data validation
    const product = await Product.create({
      ...productData,
      // Allowing any field to be set
    });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product.toJSON()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
      stack: error.stack
    });
  }
});

// Update product (intentionally vulnerable)
router.put('/:id', upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Intentionally no authorization check - anyone can update any product
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID: ${id}`
      });
    }
    
    // Process new images if uploaded
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => `/uploads/${file.filename}`);
    }
    
    // Vulnerable to mass assignment
    await product.update(updateData);
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product.toJSON()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
      stack: error.stack
    });
  }
});

// Delete product (intentionally vulnerable)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Intentionally no authorization check - anyone can delete any product
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID: ${id}`
      });
    }
    
    await product.destroy();
    
    res.json({
      success: true,
      message: 'Product deleted successfully',
      deletedProduct: product.toJSON()
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
      stack: error.stack
    });
  }
});

// Additional vulnerable endpoints

// Get products by category (vulnerable to injection)
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    
    const products = await Product.findAll({
      where: { category },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: `Products in category '${category}' retrieved successfully`,
      data: products
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving products by category',
      error: error.message,
      stack: error.stack
    });
  }
});

// Search products with query parameters (MUST come first - for frontend API calls)
router.get('/search', async (req, res) => {
  console.log('🔍 SEARCH ENDPOINT HIT - Query params:', req.query);
  console.log('🔍 SEARCH ENDPOINT HIT - Full URL:', req.originalUrl);
  
  try {
    const { 
      search, 
      category, 
      condition, 
      priceMin, 
      priceMax, 
      location, 
      sortBy = 'latest',
      limit, 
      offset 
    } = req.query;
    
    let whereClause = {};
    
    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { category: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Category filter
    if (category && category !== '') {
      whereClause.category = category;
    }
    
    // Condition filter
    if (condition && condition !== '') {
      whereClause.condition = condition;
    }
    
    // Price range filtering
    if (priceMin && priceMin !== '') {
      whereClause.price = { [Op.gte]: parseFloat(priceMin) };
    }
    if (priceMax && priceMax !== '') {
      if (whereClause.price) {
        whereClause.price[Op.lte] = parseFloat(priceMax);
      } else {
        whereClause.price = { [Op.lte]: parseFloat(priceMax) };
      }
    }
    
    // Location filter
    if (location && location !== '') {
      whereClause.location = { [Op.like]: `%${location}%` };
    }
    
    // Sort order mapping
    let orderBy = ['createdAt', 'DESC'];
    switch (sortBy) {
      case 'latest':
        orderBy = ['createdAt', 'DESC'];
        break;
      case 'oldest':
        orderBy = ['createdAt', 'ASC'];
        break;
      case 'price-low':
        orderBy = ['price', 'ASC'];
        break;
      case 'price-high':
        orderBy = ['price', 'DESC'];
        break;
      case 'popular':
        orderBy = ['likes', 'DESC'];
        break;
      default:
        orderBy = ['createdAt', 'DESC'];
    }
    
    const products = await Product.findAll({
      where: whereClause,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      order: [orderBy]
    });
    
    const totalProducts = await Product.count({ where: whereClause });
    
    res.json({
      success: true,
      message: 'Search results retrieved successfully',
      data: products,
      pagination: {
        total: totalProducts,
        limit: limit ? parseInt(limit) : products.length,
        offset: offset ? parseInt(offset) : 0
      },
      searchParams: {
        search,
        category,
        condition,
        priceMin,
        priceMax,
        location,
        sortBy
      }
    });
    
  } catch (error) {
    console.error('Search endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message,
      stack: error.stack
    });
  }
});

// Search products (vulnerable to injection) - path parameter version  
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    // Intentionally vulnerable: SQL injection possible
    const products = await Product.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
          { category: { [Op.like]: `%${query}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: `Search results for '${query}'`,
      data: products,
      searchQuery: query
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message,
      stack: error.stack,
      searchQuery: query
    });
  }
});

// Get popular products (is_sold = 0, ordered by likes DESC)
router.get('/popular', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const popularProducts = await Product.findAll({
      where: { isSold: false },
      order: [['likes', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      message: 'Popular products retrieved successfully',
      data: popularProducts
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving popular products',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get recent products (is_sold = 0, ordered by created_at DESC)
router.get('/recent', async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    
    const recentProducts = await Product.findAll({
      where: { isSold: false },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      message: 'Recent products retrieved successfully',
      data: recentProducts
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving recent products',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get product by ID (intentionally vulnerable) - MOVED here after search routes
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID: ${id}`
      });
    }
    
    // Increment views (vulnerable to race conditions)
    await product.incrementViews();
    
    // Get seller information (exposing sensitive data)
    const seller = await User.findByPk(product.userId);
    
    res.json({
      success: true,
      message: 'Product retrieved successfully',
      data: {
        ...product.toJSON(),
        seller: seller ? seller.toJSON() : null // Exposing all seller data
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving product',
      error: error.message,
      stack: error.stack
    });
  }
});

// Like product (vulnerable to manipulation)
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }
    
    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'weak-secret-123';
    
    // Intentionally vulnerable: No proper token validation
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }
    
    const userId = decoded.id;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID: ${id}`
      });
    }
    
    // Check if user already liked this product
    const existingLike = await UserLikes.findOne({
      where: { userId, productId: id }
    });
    
    if (existingLike) {
      return res.status(400).json({
        success: false,
        message: '이미 찜한 상품입니다.'
      });
    }
    
    // Add like to user_likes table
    await UserLikes.create({
      userId,
      productId: id
    });
    
    // Increment product likes count
    product.likes += 1;
    await product.save();
    
    res.json({
      success: true,
      message: '상품을 찜했습니다.',
      data: { likes: product.likes }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking product',
      error: error.message,
      stack: error.stack
    });
  }
});

// Unlike product
router.delete('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }
    
    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'weak-secret-123';
    
    // Intentionally vulnerable: No proper token validation
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }
    
    const userId = decoded.id;
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID: ${id}`
      });
    }
    
    // Check if user has liked this product
    const existingLike = await UserLikes.findOne({
      where: { userId, productId: id }
    });
    
    if (!existingLike) {
      return res.status(400).json({
        success: false,
        message: '찜하지 않은 상품입니다.'
      });
    }
    
    // Remove like from user_likes table
    await existingLike.destroy();
    
    // Decrement product likes count
    product.likes = Math.max(product.likes - 1, 0);
    await product.save();
    
    res.json({
      success: true,
      message: '찜을 취소했습니다.',
      data: { likes: product.likes }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unliking product',
      error: error.message,
      stack: error.stack
    });
  }
});

// Check if user liked a product
router.get('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get user ID from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }
    
    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'weak-secret-123';
    
    // Intentionally vulnerable: No proper token validation
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }
    
    const userId = decoded.id;
    
    const existingLike = await UserLikes.findOne({
      where: { userId, productId: id }
    });
    
    res.json({
      success: true,
      data: { isLiked: !!existingLike }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking like status',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get user's liked products
router.get('/user/liked', async (req, res) => {
  try {
    // Get user ID from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }
    
    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'weak-secret-123';
    
    // Intentionally vulnerable: No proper token validation
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: '유효하지 않은 토큰입니다.'
      });
    }
    
    const userId = decoded.id;
    
    // Get user likes first
    const userLikes = await UserLikes.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    
    // Get product IDs from user likes
    const productIds = userLikes.map(like => like.productId);
    
    // If no liked products, return empty array
    if (productIds.length === 0) {
      return res.json({
        success: true,
        message: '사용자의 찜한 상품을 가져왔습니다.',
        data: [],
        pagination: {
          total: 0
        }
      });
    }
    
    // Fetch products separately to avoid association issues
    const likedProducts = await Product.findAll({
      where: { id: productIds },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: '사용자의 찜한 상품을 가져왔습니다.',
      data: likedProducts,
      pagination: {
        total: likedProducts.length
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error getting user liked products',
      error: error.message,
      stack: error.stack
    });
  }
});



module.exports = router;
