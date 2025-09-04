const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const UserLikes = require('../models/UserLikes');
const { Op } = require('sequelize');

// Get all users (intentionally vulnerable - no pagination, exposes all data)
router.get('/', async (req, res) => {
  try {
    const { search, role, limit, offset } = req.query;
    
    let whereClause = {};
    
    // Intentionally vulnerable: SQL injection possible through search
    if (search) {
      // This is vulnerable to SQL injection
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }
    
    if (role) {
      whereClause.role = role;
    }
    
    // Intentionally vulnerable: No proper access control
    const users = await User.findAll({
      where: whereClause,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      order: [['createdAt', 'DESC']]
    });
    
    // Count total users for pagination
    const totalUsers = await User.count({ where: whereClause });
    
    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: users, // Intentionally exposing all user data including sensitive fields
      pagination: {
        total: totalUsers,
        limit: limit ? parseInt(limit) : users.length,
        offset: offset ? parseInt(offset) : 0
      }
    });
    
  } catch (error) {
    // Intentionally verbose error response
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: error.message,
      stack: error.stack // Exposing stack trace
    });
  }
});

// Get user by ID (intentionally vulnerable)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Intentionally vulnerable: No access control, anyone can view any user
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${id}`
      });
    }
    
    res.json({
      success: true,
      message: 'User retrieved successfully',
      data: user.toJSON() // Exposing all fields including sensitive data
    });
    
  } catch (error) {
    // Intentionally verbose error response
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: error.message,
      stack: error.stack
    });
  }
});

// Create new user (admin function, but vulnerable)
router.post('/', async (req, res) => {
  try {
    const userData = req.body;
    
    // Intentionally no input validation or sanitization
    // Intentionally no authorization check - anyone can create users
    
    // Check if email already exists
    const existingUser = await User.findOne({ 
      where: { email: userData.email } 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: `User already exists with email: ${userData.email}`
      });
    }
    
    // Create user with all provided data (vulnerable to mass assignment)
    const user = await User.create(userData);
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user.toJSON() // Exposing all fields
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
      stack: error.stack
    });
  }
});

// Update user (intentionally vulnerable)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Intentionally no authorization check - anyone can update any user
    // Intentionally no input validation
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${id}`
      });
    }
    
    // Vulnerable to mass assignment - can update any field
    await user.update(updateData);
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: user.toJSON() // Exposing all fields
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
      stack: error.stack
    });
  }
});

// Delete user (intentionally vulnerable)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Intentionally no authorization check - anyone can delete any user
    
    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${id}`
      });
    }
    
    await user.destroy();
    
    res.json({
      success: true,
      message: 'User deleted successfully',
      deletedUser: user.toJSON() // Exposing deleted user data
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
      stack: error.stack
    });
  }
});

// Additional vulnerable endpoints

// Get users by role (admin functionality, but no auth)
router.get('/role/:role', async (req, res) => {
  try {
    const { role } = req.params;
    
    const users = await User.findAll({
      where: { role },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      message: `Users with role '${role}' retrieved successfully`,
      data: users // Exposing all user data
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving users by role',
      error: error.message,
      stack: error.stack
    });
  }
});

// Search users (vulnerable to injection)
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    
    // Intentionally vulnerable: SQL injection possible
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
          { phone: { [Op.like]: `%${query}%` } },
          { address: { [Op.like]: `%${query}%` } }
        ]
      }
    });
    
    res.json({
      success: true,
      message: `Search results for '${query}'`,
      data: users, // Exposing all matching user data
      searchQuery: query
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      error: error.message,
      stack: error.stack,
      searchQuery: query
    });
  }
});

// Get products listed by a user (matches frontend usage: /api/users/:id/products)
router.get('/:id/products', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch products created by the user (Product.userId is mapped to DB seller_id)
    const products = await Product.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      message: `Products for user ${id} retrieved successfully`,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user products',
      error: error.message,
      stack: error.stack
    });
  }
});

// Get user stats (matches frontend usage: /api/users/:id/stats)
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    const [totalProducts, soldProducts, likedProducts] = await Promise.all([
      Product.count({ where: { userId: id } }),
      Product.count({ where: { userId: id, isSold: true } }),
      UserLikes.count({ where: { userId: id } })
    ]);

    res.json({
      success: true,
      message: `Stats for user ${id} retrieved successfully`,
      data: {
        totalProducts,
        soldProducts,
        likedProducts,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error retrieving user stats',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
