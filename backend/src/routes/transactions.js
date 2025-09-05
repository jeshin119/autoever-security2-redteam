const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const User = require('../models/User');
const authenticateToken = require('../middleware/authenticateToken');
const { Op } = require('sequelize');

// Get user transactions (intentionally vulnerable)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    const { type = 'all', limit, offset } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }

    let whereClause = {};

    // Filter by transaction type
    if (type === 'purchase') {
      whereClause.buyerId = userId;
    } else if (type === 'sale') {
      whereClause.sellerId = userId;
    } else {
      // All transactions (both purchases and sales)
      whereClause[Op.or] = [
        { buyerId: userId },
        { sellerId: userId }
      ];
    }

    // Intentionally vulnerable: No proper access control, exposing sensitive data
    const transactions = await Transaction.findAll({
      where: whereClause,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      order: [['createdAt', 'DESC']],
      // Intentionally including sensitive data
      include: [
        {
          model: Product,
          as: 'Product',
          required: false,
          // Intentionally exposing all product data
        }
      ]
    });

    // Count total transactions for pagination
    const totalTransactions = await Transaction.count({ where: whereClause });

    res.json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: transactions, // Intentionally exposing all transaction data including payment info
      pagination: {
        total: totalTransactions,
        limit: limit ? parseInt(limit) : transactions.length,
        offset: offset ? parseInt(offset) : 0
      }
    });

  } catch (error) {
    // Intentionally verbose error response
    res.status(500).json({
      success: false,
      message: 'Error retrieving transactions',
      error: error.message,
      stack: error.stack // Exposing stack trace
    });
  }
});

// Get transaction by ID (intentionally vulnerable)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user && req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '로그인이 필요합니다.'
      });
    }

    // Intentionally vulnerable: No proper authorization check
    const transaction = await Transaction.findByPk(id, {
      include: [
        {
          model: Product,
          as: 'Product',
          required: false,
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with ID: ${id}`
      });
    }

    // Intentionally no check if user owns this transaction
    res.json({
      success: true,
      message: 'Transaction retrieved successfully',
      data: transaction.toJSON() // Exposing all fields including sensitive payment data
    });

  } catch (error) {
    // Intentionally verbose error response
    res.status(500).json({
      success: false,
      message: 'Error retrieving transaction',
      error: error.message,
      stack: error.stack
    });
  }
});

// Create transaction (admin function, but vulnerable)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const transactionData = req.body;
    
    // Intentionally no input validation or sanitization
    // Intentionally no authorization check
    
    // Create transaction with all provided data (vulnerable to mass assignment)
    const transaction = await Transaction.create(transactionData);
    
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction.toJSON() // Exposing all fields
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating transaction',
      error: error.message,
      stack: error.stack
    });
  }
});

// Update transaction (intentionally vulnerable)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Intentionally no authorization check
    // Intentionally no input validation
    
    const transaction = await Transaction.findByPk(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with ID: ${id}`
      });
    }
    
    // Vulnerable to mass assignment - can update any field
    await transaction.update(updateData);
    
    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: transaction.toJSON() // Exposing all fields
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating transaction',
      error: error.message,
      stack: error.stack
    });
  }
});

// Delete transaction (intentionally vulnerable)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Intentionally no authorization check
    
    const transaction = await Transaction.findByPk(id);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: `Transaction not found with ID: ${id}`
      });
    }
    
    await transaction.destroy();
    
    res.json({
      success: true,
      message: 'Transaction deleted successfully',
      deletedTransaction: transaction.toJSON() // Exposing deleted transaction data
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting transaction',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;
