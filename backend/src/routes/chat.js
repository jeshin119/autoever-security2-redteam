const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { ChatMessage, User, Product, ChatRoom } = sequelize.models;

// Get chat rooms for a user
router.get('/rooms', async (req, res) => {
  try {
    const userId = req.user.id;
    
    // ChatRoom 테이블에서 사용자가 참여한 방들을 조회 (나가지 않은 방만)
    const chatRooms = await ChatRoom.findAll({
      where: {
        [Op.or]: [
          { user1_id: userId, user1_left: false },
          { user2_id: userId, user2_left: false }
        ]
      },
      include: [
        { model: User, as: 'User1', attributes: ['id', 'name', 'profile_image'] },
        { model: User, as: 'User2', attributes: ['id', 'name', 'profile_image'] },
        { model: Product, as: 'Product', attributes: ['id', 'title', 'price', 'images'] }
      ],
      order: [['updatedAt', 'DESC']]
    });

    // 각 방의 마지막 메시지와 상대방 정보를 가져와서 응답 구성
    const roomsWithLastMessage = await Promise.all(
      chatRooms.map(async (room) => {
        const otherUserId = room.user1_id === userId ? room.user2_id : room.user1_id;
        const otherUser = room.user1_id === userId ? room.User2 : room.User1;
        
        // 마지막 메시지 조회
        const lastMessage = await ChatMessage.findOne({
          where: { room_id: room.id },
          order: [['createdAt', 'DESC']]
        });

        return {
          id: room.id, // ChatRoom의 실제 ID
          partnerId: otherUserId, // 상대방 ID
          name: otherUser.name,
          profile_image: otherUser.profile_image,
          lastMessage: lastMessage ? lastMessage.message : null,
          timestamp: lastMessage ? lastMessage.createdAt : room.updatedAt,
          productTitle: room.Product ? room.Product.title : null,
          productPrice: room.Product ? room.Product.price : null,
          productImage: room.Product && room.Product.images ? room.Product.images : null,
          productId: room.product_id
        };
      })
    );

    res.json({ success: true, data: roomsWithLastMessage });
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch chat rooms', error: error.message });
  }
});

// Get or create a chat room
router.post('/rooms/get-or-create', async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetUserId, targetProductId } = req.body;

    // Find if a chat room already exists between these two users for this product
    const existingRoom = await ChatRoom.findOne({
      where: {
        product_id: targetProductId,
        [Op.or]: [
          { user1_id: userId, user2_id: targetUserId },
          { user1_id: targetUserId, user2_id: userId }
        ]
      },
      include: [
        { model: User, as: 'User1', attributes: ['id', 'name', 'profile_image'] },
        { model: User, as: 'User2', attributes: ['id', 'name', 'profile_image'] },
        { model: Product, as: 'Product', attributes: ['id', 'title', 'price', 'images'] }
      ]
    });

    const otherUser = await User.findByPk(targetUserId, { attributes: ['id', 'name', 'profile_image'] });
    const product = await Product.findByPk(targetProductId, { attributes: ['id', 'title', 'price', 'images'] });

    if (!otherUser || !product) {
      return res.status(404).json({ success: false, message: 'User or Product not found' });
    }

    let chatRoomInfo;

    if (existingRoom) {
      // 기존 방이 있으면 해당 방 정보 반환
      chatRoomInfo = {
        id: existingRoom.id,
        name: otherUser.name,
        profile_image: otherUser.profile_image,
        productTitle: product.title,
        productPrice: product.price,
        productImage: product.images ? product.images : null,
        productId: product.id,
        partnerId: otherUser.id,
        isExistingChat: true
      };
    } else {
      // 새 방 생성
      const newRoom = await ChatRoom.create({
        product_id: targetProductId,
        user1_id: userId,
        user2_id: targetUserId,
        user1_left: false,
        user2_left: false,
        created_by: userId
      });

      chatRoomInfo = {
        id: newRoom.id,
        name: otherUser.name,
        profile_image: otherUser.profile_image,
        productTitle: product.title,
        productPrice: product.price,
        productImage: product.images ? product.images : null,
        productId: product.id,
        partnerId: otherUser.id,
        isExistingChat: false
      };
    }

    res.json({ success: true, data: chatRoomInfo });

  } catch (error) {
    console.error('Error in get-or-create chat room:', error);
    res.status(500).json({ success: false, message: 'Failed to get or create chat room', error: error.message });
  }
});

// Get messages for a chat room
router.get('/rooms/:roomId/messages', async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = parseInt(req.params.roomId);

    // 채팅방 정보 조회
    const chatRoom = await ChatRoom.findByPk(roomId);
    if (!chatRoom) {
      return res.status(404).json({ success: false, message: '채팅방을 찾을 수 없습니다.' });
    }

    // 사용자가 해당 채팅방의 참여자인지 확인
    if (chatRoom.user1_id !== userId && chatRoom.user2_id !== userId) {
      return res.status(403).json({ success: false, message: '해당 채팅방에 참여할 권한이 없습니다.' });
    }

    const messages = await ChatMessage.findAll({
      where: {
        room_id: roomId
      },
      order: [['createdAt', 'ASC']]
    });

    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch messages', error: error.message });
  }
});

// Send a message to a chat room
router.post('/rooms/:roomId/messages', async (req, res) => {
  try {
    const userId = req.user.id;
    const roomId = parseInt(req.params.roomId);
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    // 채팅방 정보 조회
    const chatRoom = await ChatRoom.findByPk(roomId);
    if (!chatRoom) {
      return res.status(404).json({ success: false, message: '채팅방을 찾을 수 없습니다.' });
    }

    // 사용자가 해당 채팅방의 참여자인지 확인
    if (chatRoom.user1_id !== userId && chatRoom.user2_id !== userId) {
      return res.status(403).json({ success: false, message: '해당 채팅방에 참여할 권한이 없습니다.' });
    }

    // 상대방 ID 결정
    const receiverId = chatRoom.user1_id === userId ? chatRoom.user2_id : chatRoom.user1_id;

    const newMessage = await ChatMessage.create({
      sender_id: userId,
      receiver_id: receiverId,
      message: message,
      product_id: chatRoom.product_id,
      room_id: roomId // ChatRoom ID 저장
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: 'Failed to send message', error: error.message });
  }
});

// Leave a chat room
router.post('/rooms/:roomId/leave', async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user.id;
    
    // 1. 채팅방 정보 조회
    const chatRoom = await ChatRoom.findByPk(roomId);
    if (!chatRoom) {
      return res.status(404).json({ success: false, message: '채팅방을 찾을 수 없습니다.' });
    }
    
    // 2. 사용자가 해당 채팅방의 참여자인지 확인
    if (chatRoom.user1_id !== userId && chatRoom.user2_id !== userId) {
      return res.status(403).json({ success: false, message: '해당 채팅방에 참여할 권한이 없습니다.' });
    }
    
    // 3. 해당 사용자를 "나감" 상태로 표시
    if (chatRoom.user1_id === userId) {
      chatRoom.user1_left = true;
    } else if (chatRoom.user2_id === userId) {
      chatRoom.user2_left = true;
    }
    
    await chatRoom.save();
    
    // 4. 두 사용자 모두 나갔는지 확인
    if (chatRoom.user1_left && chatRoom.user2_left) {
      // 모든 인원이 나갔으면 채팅방과 메시지 삭제
      await ChatMessage.destroy({ where: { room_id: roomId } });
      await chatRoom.destroy();
      
      return res.json({ 
        success: true, 
        message: '채팅방이 완전히 삭제되었습니다.',
        deleted: true 
      });
    }
    
    res.json({ 
      success: true, 
      message: '채팅방을 나갔습니다. 상대방이 다시 참여할 수 있습니다.',
      deleted: false 
    });
    
  } catch (error) {
    console.error('Error leaving chat room:', error);
    res.status(500).json({ success: false, message: '채팅방 나가기 실패', error: error.message });
  }
});

module.exports = router;
