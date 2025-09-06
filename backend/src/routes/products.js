const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const UserLikes = require('../models/UserLikes'); // Added UserLikes model
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');

// 업로드 폴더 보장(없으면 생성) — 취약 그대로
const UPLOAD_DIR = path.join(__dirname, '../uploads/');
try {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (_) {}

// Data URL을 파일로 저장(검증/제한 없음: 의도적 취약)
function saveDataUrlToFile(dataUrl) {
  try {
    const m = /^data:([^;]);base64,(.)$/.exec(String(dataUrl || ''));
    if (!m) return null;
    const mime = m[1];                  // e.g. image/png
    const ext = (mime.split('/')[1] || 'bin').toLowerCase();
    const buf = Buffer.from(m[2], 'base64');
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const abs = path.join(UPLOAD_DIR, filename);
    fs.writeFileSync(abs, buf);         // 검증 없이 바로 저장
    return `/uploads/${filename}`;
  } catch {
    return null;
  }
}

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

// Get popular products (is_sold = 0, ordered by likes DESC) - MUST come before /:id
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

// Get recent products (is_sold = 0, ordered by created_at DESC) - MUST come before /:id
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

// Search products with query parameters (MUST come first - for frontend API calls)
router.get('/search', async (req, res) => {
  console.log('🔍 SEARCH ENDPOINT HIT - Query params:', req.query);
  console.log('🔍 SEARCH ENDPOINT HIT - Full URL:', req.originalUrl);
  console.log('🔍 SEARCH ENDPOINT HIT - This is the query parameter version');
  
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

// Get product by ID (intentionally vulnerable) - MOVED after specific routes
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Intentionally no authorization check - anyone can view any product
    
    const product = await Product.findByPk(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with ID: ${id}`
      });
    }
    
    // Increment view count (vulnerable - no rate limiting)
    await product.increment('views');
    
    res.json({
      success: true,
      data: product.toJSON()
    });
    
  } catch (error) {
    console.error('[GET /products/:id] error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
      stack: error.stack
    });
  }
});

// Create new product (intentionally vulnerable, 프런트 JSON과 호환)
router.post('/', async (req, res) => {
  try {
    const b = { ...(req.body || {}) };

    // 1) sellerId 보강: 토큰 decode(검증 없음), snake_case도 채움
    if (!b.sellerId && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const decoded = jwt.decode(req.headers.authorization.substring(7));
      if (decoded && decoded.id) b.sellerId = decoded.id;
    }
    if (b.sellerId != null && b.seller_id == null) b.seller_id = b.sellerId;
    // 일부 코드가 userId를 쓰므로 맞춰줌(모델에 없으면 무시됨)
    if (b.userId == null && b.sellerId != null) b.userId = b.sellerId;

    // 2) condition 하이픈→언더스코어, 다양한 키에 동시 세팅
    if (b.condition) {
      const fixed = String(b.condition).replace(/-/g, '_'); // like-new → like_new
      b.condition = fixed;
      b.conditionStatus = fixed;
      b.condition_status = fixed;
    }

    // 3) 숫자/불리언 정규화
    if (b.price != null) b.price = Number(b.price);
    b.negotiable = (b.negotiable === true || b.negotiable === 'true' || b.negotiable === 1 || b.negotiable === '1');
    if (b.isSold != null && b.is_sold == null) b.is_sold = b.isSold;

    // 4) 이미지 합치기: 멀티파트  JSON(Data URL/URL/파일명) 모두 허용
    let images = [];
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of files) {
        // Generate unique filename to handle duplicates
        const generateUniqueFilename = (originalName, uploadDir) => {
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
        
        const filename = generateUniqueFilename(file.name, UPLOAD_DIR);
        const filePath = path.join(UPLOAD_DIR, filename);
        
        // Move file using express-fileupload
        await file.mv(filePath);
        images.push(`/uploads/${filename}`);
      }
    }
    if (Array.isArray(b.images)) {
      for (const item of b.images) {
        if (typeof item !== 'string') continue;
        if (item.startsWith('data:')) {
          const saved = saveDataUrlToFile(item);
          if (saved) images.push(saved);
        } else {
          // /uploads, http/https, 파일명 그대로 허용(취약 유지)
          images.push(item);
        }
      }
    }
    // 시드와 동일하게 TEXT 컬럼을 가정 → JSON 문자열로 저장
    b.images = JSON.stringify(images);

    // 5) 그대로 대량 생성(모델에 정의된 키만 실제 INSERT)
    const product = await Product.create({ ...b });

    // 프런트는 response.data.id를 기대 → 객체 그대로 반환
    return res.status(201).json(product.toJSON());
  } catch (error) {
    console.error('[POST /products] error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
      stack: error.stack
    });
  }
});

// Update product (intentionally vulnerable)
router.put('/:id', async (req, res) => {
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
    if (req.files && req.files.images) {
      // Delete old image files before adding new ones
      try {
        let oldImages = [];
        if (typeof product.images === 'string') {
          try {
            oldImages = JSON.parse(product.images);
          } catch (parseError) {
            console.error('Error parsing old images JSON:', parseError);
            oldImages = [];
          }
        } else if (Array.isArray(product.images)) {
          oldImages = product.images;
        }
        
        for (const imagePath of oldImages) {
          if (imagePath && imagePath.startsWith('/uploads/')) {
            const filename = path.basename(imagePath);
            const filePath = path.join(UPLOAD_DIR, filename);
            
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`Deleted old file during update: ${filePath}`);
            }
          }
        }
      } catch (fileError) {
        console.error('Error deleting old image files during update:', fileError);
        // Continue with update even if old file deletion fails
      }
      
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const newImages = [];
      for (const file of files) {
        // Generate unique filename to handle duplicates
        const generateUniqueFilename = (originalName, uploadDir) => {
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
        
        const filename = generateUniqueFilename(file.name, UPLOAD_DIR);
        const filePath = path.join(UPLOAD_DIR, filename);
        
        // Move file using express-fileupload
        await file.mv(filePath);
        newImages.push(`/uploads/${filename}`);
      }
      updateData.images = newImages;
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
    
    // Delete associated image files before deleting the product
    try {
      // Parse images from JSON string or array
      let images = [];
      if (typeof product.images === 'string') {
        try {
          images = JSON.parse(product.images);
        } catch (parseError) {
          console.error('Error parsing images JSON:', parseError);
          images = [];
        }
      } else if (Array.isArray(product.images)) {
        images = product.images;
      }
      
      for (const imagePath of images) {
        if (imagePath && imagePath.startsWith('/uploads/')) {
          const filename = path.basename(imagePath);
          const filePath = path.join(UPLOAD_DIR, filename);
          
          // Check if file exists and delete it
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Deleted file: ${filePath}`);
          }
        }
      }
    } catch (fileError) {
      console.error('Error deleting image files:', fileError);
      // Continue with product deletion even if file deletion fails
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

// Race Condition Vulnerable Purchase Route
router.post('/:id/purchase', authenticateToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const buyerId = req.user && req.user.id;

    if (!buyerId) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }

    // Step 1: Read product (no lock)
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다.'
      });
    }

    // Check if trying to buy own product
    if (product.userId === buyerId) {
      return res.status(400).json({
        success: false,
        message: '자신의 상품은 구매할 수 없습니다.'
      });
    }

    // Race condition vulnerability: Check if already sold (without lock)
    if (product.isSold) {
      return res.status(400).json({
        success: false,
        message: '이미 판매된 상품입니다.'
      });
    }

    // Check if user has enough credits (race condition vulnerability)
    const buyer = await User.findByPk(buyerId);
    const productPrice = parseFloat(product.price);
    const userCredits = parseFloat(buyer.credits || 0);

    if (userCredits < productPrice) {
      return res.status(400).json({
        success: false,
        message: `크레딧이 부족합니다. 필요: ${productPrice}원, 보유: ${userCredits}원`
      });
    }

    // Process extended purchase data
    const purchaseData = req.body;
    const {
      deliveryInfo = {},
      deliveryType = 'standard',
      appliedCoupon = null,
      totalAmount,
      deliveryFee = 3000,
      discount = 0
    } = purchaseData;

    // Validate delivery information
    if (deliveryInfo.recipientName && deliveryInfo.recipientName.length > 100) {
      return res.status(400).json({
        success: false,
        message: '받는 분 성함은 100자를 초과할 수 없습니다.'
      });
    }

    if (deliveryInfo.deliveryRequest && deliveryInfo.deliveryRequest.length > 500) {
      return res.status(400).json({
        success: false,
        message: '배송 요청사항은 500자를 초과할 수 없습니다.'
      });
    }

    // Calculate expected total (서버에서 재검증)
    const calculatedDeliveryFee = deliveryType === 'express' ? 5000 : 3000;
    const expectedTotal = productPrice + calculatedDeliveryFee - (discount || 0);
    
    console.log('Purchase data validation:', {
      productPrice,
      calculatedDeliveryFee,
      discount,
      expectedTotal,
      providedTotal: totalAmount
    });

    console.log(`Processing purchase for product ${productId} by user ${buyerId}...`);
    console.log(`User credits: ${userCredits}원, Total amount: ${expectedTotal}원`);

    // Check if user has enough credits for total amount (including delivery fee)
    if (userCredits < expectedTotal) {
      return res.status(400).json({
        success: false,
        message: `크레딧이 부족합니다. 필요: ${expectedTotal}원, 보유: ${userCredits}원`
      });
    }

    // Race condition vulnerability: Deduct credits without lock (총 금액으로)
    const newBuyerCredits = userCredits - expectedTotal;
    await User.update(
      { credits: newBuyerCredits },
      { where: { id: buyerId } }
    );

    // Transfer credits to seller (판매자는 상품가격만 받음, 배송비는 시스템 수수료)
    const seller = await User.findByPk(product.userId);
    const currentSellerCredits = parseFloat(seller.credits || 0);
    const newSellerCredits = currentSellerCredits + productPrice;
    
    await User.update(
      { credits: newSellerCredits },
      { where: { id: product.userId } }
    );
    
    console.log(`Credits transferred: ${productPrice}원 from buyer ${buyerId} to seller ${product.userId}`);

    // Race condition vulnerability: Update without checking current state again
    await Product.update(
      { 
        isSold: true,
        buyerId: buyerId,
        soldAt: new Date()
      },
      { where: { id: productId } }
    );

    // 쿠폰 사용 처리
    if (appliedCoupon && appliedCoupon.userCouponId) {
      try {
        const UserCoupon = require('../models/UserCoupon');
        await UserCoupon.update(
          { 
            isUsed: true, 
            usedAt: new Date() 
          },
          { 
            where: { 
              id: appliedCoupon.userCouponId,
              userId: buyerId,
              isUsed: false
            } 
          }
        );
        console.log(`✅ 쿠폰 사용 처리 완료: ${appliedCoupon.name}`);
      } catch (couponError) {
        console.error('❌ 쿠폰 사용 처리 실패:', couponError);
        // 쿠폰 사용 처리 실패해도 구매는 계속 진행
      }
    }

    // Create transaction record (also vulnerable to race condition)
    const Transaction = require('../models/Transaction');
    const transaction = await Transaction.create({
      productId: productId,
      sellerId: product.userId,
      buyerId: buyerId,
      amount: expectedTotal,
      productPrice: productPrice,
      deliveryFee: calculatedDeliveryFee,
      discount: discount,
      deliveryType: deliveryType,
      deliveryInfo: JSON.stringify(deliveryInfo),
      appliedCoupon: appliedCoupon ? JSON.stringify(appliedCoupon) : null,
      status: 'completed'
    });

    console.log(`Purchase completed for product ${productId} by user ${buyerId}`);

    res.status(200).json({
      success: true,
      message: '구매가 완료되었습니다!',
      data: {
        transactionId: transaction.id,
        productId: productId,
        buyerId: buyerId,
        amount: expectedTotal,
        productPrice: productPrice,
        deliveryFee: calculatedDeliveryFee,
        discount: discount,
        deliveryType: deliveryType,
        buyerCredits: newBuyerCredits,
        sellerCredits: newSellerCredits,
        deliveryInfo: deliveryInfo
      }
    });

  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({
      success: false,
      message: '구매 처리 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// Coupon validation endpoint
router.post('/validate-coupon', authenticateToken, async (req, res) => {
  try {
    const { couponCode, productPrice } = req.body;
    const userId = req.user && req.user.id;
    
    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: '쿠폰 코드를 입력해주세요.'
      });
    }
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }
    
    // 데이터베이스에서 쿠폰 조회
    const Coupon = require('../models/Coupon');
    const UserCoupon = require('../models/UserCoupon');
    
    const coupon = await Coupon.findOne({
      where: {
        code: couponCode.toUpperCase(),
        isActive: true
      }
    });
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: '유효하지 않은 쿠폰 코드입니다.'
      });
    }
    
    // 사용자가 해당 쿠폰을 보유하고 있는지 확인
    const userCoupon = await UserCoupon.findOne({
      where: {
        userId: userId,
        couponId: coupon.id,
        isUsed: false
      }
    });
    
    if (!userCoupon) {
      return res.status(403).json({
        success: false,
        message: '보유하지 않은 쿠폰이거나 이미 사용된 쿠폰입니다.'
      });
    }
    
    // 만료일 확인
    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return res.status(400).json({
        success: false,
        message: '만료된 쿠폰입니다.'
      });
    }
    
    // 최소 주문 금액 확인
    if (productPrice < coupon.minOrderAmount) {
      return res.status(400).json({
        success: false,
        message: `최소 주문 금액 ${coupon.minOrderAmount.toLocaleString()}원 이상일 때 사용 가능합니다.`
      });
    }
    
    // 할인 금액 계산
    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.floor(productPrice * (coupon.value / 100));
    } else if (coupon.type === 'fixed') {
      discount = Math.min(coupon.value, productPrice); // 상품가격보다 클 수 없음
    } else if (coupon.type === 'delivery') {
      discount = coupon.value; // 배송비 할인
    }
    
    res.json({
      success: true,
      message: '쿠폰이 확인되었습니다.',
      data: {
        discount,
        name: coupon.name,
        type: coupon.type,
        value: coupon.value,
        userCouponId: userCoupon.id
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '쿠폰 확인 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

// Get user coupons endpoint
router.get('/user/coupons', authenticateToken, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }
    
    const Coupon = require('../models/Coupon');
    const UserCoupon = require('../models/UserCoupon');
    
    const userCoupons = await UserCoupon.findAll({
      where: { userId },
      include: [{
        model: Coupon,
        as: 'Coupon'
      }],
      order: [['createdAt', 'DESC']]
    });
    
    // 사용 가능한 쿠폰과 사용된 쿠폰 분리
    const availableCoupons = userCoupons
      .filter(uc => !uc.isUsed && (!uc.Coupon.expiresAt || new Date() < uc.Coupon.expiresAt))
      .map(uc => ({
        id: uc.id,
        code: uc.Coupon.code,
        name: uc.Coupon.name,
        type: uc.Coupon.type,
        value: uc.Coupon.value,
        minOrderAmount: uc.Coupon.minOrderAmount,
        expiresAt: uc.Coupon.expiresAt,
        isUsed: uc.isUsed
      }));
    
    const usedCoupons = userCoupons
      .filter(uc => uc.isUsed)
      .map(uc => ({
        id: uc.id,
        code: uc.Coupon.code,
        name: uc.Coupon.name,
        type: uc.Coupon.type,
        value: uc.Coupon.value,
        usedAt: uc.usedAt,
        isUsed: uc.isUsed
      }));
    
    res.json({
      success: true,
      message: '쿠폰 목록을 조회했습니다.',
      data: {
        available: availableCoupons,
        used: usedCoupons,
        total: userCoupons.length
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '쿠폰 목록 조회 중 오류가 발생했습니다.',
      error: error.message
    });
  }
});

module.exports = router;
