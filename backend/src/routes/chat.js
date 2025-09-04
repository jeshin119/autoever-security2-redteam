const express = require('express');
const router = express.Router();
const User = require('../models/User');

// In-memory chat storage for demo purposes
let chatRooms = [
  {
    id: 1,
    name: '김철수',
    lastMessage: '안녕하세요! 아이폰 상태가 어떤가요?',
    timestamp: new Date(),
    unreadCount: 2,
    productTitle: '아이폰 14 Pro 128GB'
  },
  {
    id: 2,
    name: '이영희',
    lastMessage: '네, 내일 직거래 가능할까요?',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    unreadCount: 0,
    productTitle: '북유럽 원목 식탁'
  }
];

let messages = {
  1: [
    { id: 1, senderId: 2, message: '안녕하세요!', timestamp: new Date(Date.now() - 7200000) },
    { id: 2, senderId: 2, message: '아이폰 상태가 어떤가요?', timestamp: new Date(Date.now() - 3600000) },
    { id: 3, senderId: 1, message: '안녕하세요! 거의 새것이에요', timestamp: new Date(Date.now() - 1800000) }
  ],
  2: [
    { id: 4, senderId: 3, message: '식탁 언제 볼 수 있을까요?', timestamp: new Date(Date.now() - 7200000) },
    { id: 5, senderId: 1, message: '내일 오후 어떠세요?', timestamp: new Date(Date.now() - 3600000) },
    { id: 6, senderId: 3, message: '네, 내일 직거래 가능할까요?', timestamp: new Date(Date.now() - 1800000) }
  ]
};

// Get chat rooms
router.get('/rooms', (req, res) => {
  try {
    res.json({
      success: true,
      data: chatRooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat rooms',
      error: error.message
    });
  }
});

// Get specific chat room
router.get('/rooms/:roomId', (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId);
    const room = chatRooms.find(r => r.id === roomId);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found'
      });
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat room',
      error: error.message
    });
  }
});

// Get messages for a chat room
router.get('/rooms/:roomId/messages', (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId);
    const roomMessages = messages[roomId] || [];
    
    res.json({
      success: true,
      data: roomMessages,
      pagination: {
        total: roomMessages.length,
        limit: 50,
        offset: 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message
    });
  }
});

// Send message
router.post('/rooms/:roomId/messages', (req, res) => {
  try {
    const roomId = parseInt(req.params.roomId);
    const { message, senderId } = req.body;
    
    if (!message || !senderId) {
      return res.status(400).json({
        success: false,
        message: 'Message and senderId are required'
      });
    }
    
    const room = chatRooms.find(r => r.id === roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Chat room not found'
      });
    }
    
    // Create new message
    const newMessage = {
      id: Date.now(),
      senderId: parseInt(senderId),
      message: message,
      timestamp: new Date()
    };
    
    // Add to messages
    if (!messages[roomId]) {
      messages[roomId] = [];
    }
    messages[roomId].push(newMessage);
    
    // Update room last message
    room.lastMessage = message;
    room.timestamp = new Date();
    
    res.json({
      success: true,
      data: newMessage,
      message: 'Message sent successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Legacy routes for compatibility
router.get('/', (req, res) => {
  res.redirect('/api/chat/rooms');
});

router.get('/:id', (req, res) => {
  res.redirect(`/api/chat/rooms/${req.params.id}`);
});

router.post('/', (req, res) => {
  res.json({ 
    success: false, 
    message: 'Please use /api/chat/rooms/:roomId/messages to send messages' 
  });
});

module.exports = router;
