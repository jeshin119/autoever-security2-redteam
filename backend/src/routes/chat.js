const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { ChatMessage, User, Product } = sequelize.models;

// Get chat rooms for a user
router.get('/rooms', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user is authenticated
    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [{ sender_id: userId }, { receiver_id: userId }]
      },
      include: [
        { model: User, as: 'Sender', attributes: ['id', 'name', 'profile_image'] },
        { model: User, as: 'Receiver', attributes: ['id', 'name', 'profile_image'] },
        { model: Product, as: 'Product', attributes: ['id', 'title', 'price', 'images'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    const rooms = {};
    messages.forEach(msg => {
      const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      if (!rooms[otherUserId]) {
        const otherUser = msg.sender_id === userId ? msg.Receiver : msg.Sender;
        rooms[otherUserId] = {
          id: otherUserId, // Room ID is the other user's ID
          name: otherUser.name,
          profile_image: otherUser.profile_image,
          lastMessage: msg.message,
          timestamp: msg.createdAt,
          productTitle: msg.Product ? msg.Product.title : null,
          productPrice: msg.Product ? msg.Product.price : null,
          productImage: msg.Product && msg.Product.images ? msg.Product.images : null,
          productId: msg.product_id
        };
      }
    });

    res.json({ success: true, data: Object.values(rooms) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch chat rooms', error: error.message });
  }
});

// Get or create a chat room
router.post('/rooms/get-or-create', async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId, targetProductId } = req.body;

    // Find if a chat already exists between these two users for this product
    const existingMessage = await ChatMessage.findOne({
      where: {
        product_id: targetProductId,
        [Op.or]: [
          { sender_id: userId, receiver_id: targetUserId },
          { sender_id: targetUserId, receiver_id: userId }
        ]
      }
    });

    const otherUser = await User.findByPk(targetUserId, { attributes: ['id', 'name', 'profile_image'] });
    const product = await Product.findByPk(targetProductId, { attributes: ['id', 'title', 'price', 'images'] });

    if (!otherUser || !product) {
      return res.status(404).json({ success: false, message: 'User or Product not found' });
    }

    const chatRoomInfo = {
      id: existingMessage ? existingMessage.id : otherUser.id, // Use otherUser.id as room ID for new chats
      name: otherUser.name,
      profile_image: otherUser.profile_image,
      productTitle: product.title,
      productPrice: product.price,
      productImage: product.images ? product.images : null,
      productId: product.id,
      partnerId: otherUser.id,
      // Indicate if it's an existing chat or a new one
      isExistingChat: !!existingMessage
    };

    res.json({ success: true, data: chatRoomInfo });

  } catch (error) {
    console.error('Error in get-or-create chat room:', error);
    res.status(500).json({ success: false, message: 'Failed to get or create chat room', error: error.message });
  }
});

// Get messages for a chat room (with another user)
router.get('/rooms/:otherUserId/messages', async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = parseInt(req.params.otherUserId);

    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { sender_id: userId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: userId }
        ]
      },
      order: [['createdAt', 'ASC']]
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
});

// Send a message to a chat room
router.post('/rooms/:otherUserId/messages', async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = parseInt(req.params.otherUserId);
    const { message, productId } = req.body; // Assuming productId is also sent in the body

    if (!message || !productId) {
      return res.status(400).json({ success: false, message: 'Message content and productId are required' });
    }

    const newMessage = await ChatMessage.create({
      sender_id: userId,
      receiver_id: otherUserId,
      message: message,
      product_id: productId // Store productId with the message
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
});

module.exports = router;
