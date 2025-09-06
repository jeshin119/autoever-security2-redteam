import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiSend, FiImage, FiArrowLeft, FiMoreHorizontal, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { chatService, getImageUrl } from '../services/api';
import io from 'socket.io-client';

const Container = styled.div`
  height: calc(100vh - 60px);
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
`;

const ChatList = styled.div`
  width: 350px;
  border-right: 1px solid ${props => props.theme.colors.border};
  background: white;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: ${props => props.showList ? 'flex' : 'none'};
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    box-shadow: 2px 0 8px rgba(0,0,0,0.1);
  }
`;

const ChatListHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  background: white;
`;

const ChatListTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const ChatRooms = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const ChatRoomItem = styled.div`
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;
  background: ${props => props.active ? props.theme.colors.backgroundSecondary : 'white'};
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const ChatRoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ChatRoomName = styled.h4`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
`;

const ChatRoomTime = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const ChatRoomPreview = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.backgroundSecondary};

  @media (max-width: 768px) {
    display: ${props => props.showChat ? 'flex' : 'none'};
  }
`;

const ChatHeader = styled.div`
  padding: 1rem 1.5rem;
  background: white;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ChatPartner = styled.div``;

const PartnerName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const PartnerStatus = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const ChatHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const MessageGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.isOwn ? 'flex-end' : 'flex-start'};
  gap: 0.25rem;
`;

const Message = styled.div`
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 18px;
  background: ${props => props.isOwn ? props.theme.colors.primary : 'white'};
  color: ${props => props.isOwn ? 'white' : props.theme.colors.text};
  font-size: 0.95rem;
  line-height: 1.4;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0.5rem;
`;

const MessageInput = styled.div`
  padding: 1rem 1.5rem;
  background: white;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputField = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 25px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const AttachButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const ProductCard = styled.div`
  background: white;
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 1rem;
`;

const ProductImage = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.image ? `url(${props.image})` : props.theme.colors.backgroundSecondary};
  background-size: cover;
  background-position: center;
  border-radius: 4px;
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: ${props => props.theme.colors.text};
`;

const ProductPrice = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

// Leave Chat Modal Styles
const LeaveModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const LeaveModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
`;

const LeaveModalTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.text};
`;

const LeaveModalMessage = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const LeaveModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;

const ConfirmLeaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  
  &:hover {
    background: #c82333;
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
  }
`;

const ChatPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { user } = useAuth();
  const [showList, setShowList] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveLoading, setLeaveLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (user && user.id) {
      const newSocket = io('http://localhost:3001', {
        transports: ['polling', 'websocket'], // polling을 먼저 시도
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        upgrade: true, // polling에서 websocket으로 업그레이드 허용
        rememberUpgrade: false // 업그레이드 기억하지 않음
      });
      
      setSocket(newSocket);
      
      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Socket.IO connected:', newSocket.id);
        setIsSocketConnected(true);
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error);
        console.log('Socket.IO: Attempting to reconnect with polling only...');
        
        // WebSocket 실패 시 polling만 사용하여 재연결 시도
        if (error.message && error.message.includes('websocket')) {
          setTimeout(() => {
            newSocket.io.opts.transports = ['polling'];
            newSocket.connect();
          }, 2000);
        }
      });
      
      newSocket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason);
        setIsSocketConnected(false);
        setOnlineUsers(new Set()); // 연결이 끊어지면 모든 온라인 상태 초기화
      });
      
      newSocket.on('reconnect', (attemptNumber) => {
        console.log('Socket.IO reconnected after', attemptNumber, 'attempts');
      });
      
      newSocket.on('reconnect_error', (error) => {
        console.error('Socket.IO reconnection error:', error);
      });
      
      // Listen for user status changes
      newSocket.on('userJoinedRoom', (data) => {
        console.log('Received userJoinedRoom event:', data);
        setOnlineUsers(prev => {
          const newSet = new Set([...prev, data.userId]);
          console.log('Updated online users:', Array.from(newSet));
          return newSet;
        });
      });
      
      newSocket.on('userLeftRoom', (data) => {
        // console.log('Received userLeftRoom event:', data);
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(data.userId);
          console.log('Updated online users after user left:', Array.from(newSet));
          return newSet;
        });
      });
      
      // Handle initial users in room when joining
      newSocket.on('usersInRoom', (data) => {
        console.log('Received usersInRoom event:', data);
        setOnlineUsers(prev => {
          const newSet = new Set([...prev, ...data.userIds]);
          console.log('Updated online users from usersInRoom:', Array.from(newSet));
          return newSet;
        });
      });
      
      // Handle real-time messages
      newSocket.on('message', (data) => {
        // console.log('Received real-time message:', data);
        setMessages(prev => {
          // Skip messages sent by current user (we already have optimistic update)
          if (data.sender_id === (user && user.id)) {
            // console.log('Skipping own message from Socket.IO:', data.id);
            return prev;
          }
          
          // Check if message already exists (avoid duplicates)
          const exists = prev.some(msg => msg.id === data.id);
          if (exists) {
            // console.log('Message already exists, skipping:', data.id);
            return prev;
          }
          
          const newMessage = {
            id: data.id,
            text: data.message,
            isOwn: data.sender_id === (user && user.id),
            timestamp: data.createdAt,
            sender: data.sender_id === (user && user.id) ? user.name : '상대방'
          };
          
          // console.log('Adding new message to UI:', newMessage);
          const updatedMessages = [...prev, newMessage];
          
          // Scroll to bottom after adding received message
          setTimeout(() => {
            scrollToBottom();
          }, 100);
          
          return updatedMessages;
        });
      });
      
      return () => {
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Load chat rooms on component mount
  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const response = await chatService.getChatRooms();
        
        if (response.data && response.data.success) {
          const rooms = response.data.data.map(room => {
            console.log('Raw room data from API:', room);
            return {
              id: room.id,
              partnerName: room.name,
              lastMessage: room.lastMessage,
              lastTime: formatTimestamp(room.timestamp),
              unreadCount: room.unreadCount || 0,
              productTitle: room.productTitle,
              productPrice: room.productPrice,
              productImage: room.productImage,
              productId: room.productId,
              partnerId: room.partnerId // 백엔드에서 반환하는 상대방 ID
            };
          });
          console.log('Processed chat rooms:', rooms);
          setChatRooms(rooms);

          const targetUserId = searchParams.get('userId');
          const targetProductId = searchParams.get('productId');

          console.log('URL Params - targetUserId:', targetUserId, 'targetProductId:', targetProductId);

          if (targetUserId && targetProductId) {
            const existingRoom = rooms.find(room => 
              (room.partnerId === parseInt(targetUserId) || room.partnerId === targetUserId) && 
              (room.productId === parseInt(targetProductId) || room.productId === targetProductId)
            );

            if (existingRoom) {
              console.log('Found existing room:', existingRoom);
              selectRoom(existingRoom);
            } else {
              console.log('No existing room found, attempting to get or create...');
              // If no existing room, try to create or get one
              // This assumes chatService.getOrCreateChatRoom handles the logic on the backend
              const newRoomResponse = await chatService.getOrCreateChatRoom(targetUserId, targetProductId);
              console.log('getOrCreateChatRoom response:', newRoomResponse);
              if (newRoomResponse.data && newRoomResponse.data.success) {
                const newRoom = newRoomResponse.data.data;
                console.log('New or existing room from API:', newRoom);
                const formattedNewRoom = {
                  id: newRoom.id,
                  partnerName: newRoom.name,
                  lastMessage: newRoom.lastMessage || '',
                  lastTime: formatTimestamp(newRoom.timestamp || new Date()),
                  unreadCount: newRoom.unreadCount || 0,
                  productTitle: newRoom.productTitle,
                  productPrice: newRoom.productPrice,
                  productImage: newRoom.productImage,
                  productId: newRoom.productId,
                  partnerId: newRoom.id // room.id가 상대방 사용자 ID
                };
                setChatRooms(prev => {
                  // Remove any existing room with the same ID to avoid duplicates
                  const filtered = prev.filter(room => room.id !== formattedNewRoom.id);
                  return [formattedNewRoom, ...filtered];
                });
                selectRoom(formattedNewRoom);
              } else {
                console.error('Failed to get or create chat room from API:', newRoomResponse);
              }
            }
          }
        }
      } catch (error) {
        console.error('Failed to load chat rooms or get/create chat room:', error);
        setError('채팅방 목록을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
        setChatRooms([]); // Clear any existing rooms
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, [location.search, user]);

  // Load messages when a room is selected
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedRoom) {
        setMessages([]);
        return;
      }

      try {
        const response = await chatService.getMessages(selectedRoom.id);
        
        if (response.data && response.data.success) {
          const msgs = response.data.data.map(msg => {
            // console.log('Message from backend:', msg);
            // console.log('Current user ID:', user && user.id);
            return {
              id: msg.id,
              text: msg.message,
              isOwn: msg.sender_id === (user && user.id), // Use sender_id from backend
              timestamp: msg.createdAt,
              sender: msg.sender_id === (user && user.id) ? user.name : selectedRoom.partnerName
            };
          });
          setMessages(msgs);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fall back to mock messages
        setMessages([
          {
            id: 1,
            text: '안녕하세요! 상품 문의드립니다.',
            isOwn: false,
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            sender: selectedRoom.partnerName
          },
          {
            id: 2,
            text: '네, 안녕하세요! 어떤 것이 궁금하신가요?',
            isOwn: true,
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            sender: user && user.name
          },
          {
            id: 3,
            text: '직거래 가능한 지역이 어디인가요?',
            isOwn: false,
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            sender: selectedRoom.partnerName
          }
        ]);
      }
    };

    loadMessages();
  }, [selectedRoom, user]);

  // Remove automatic scroll on message changes
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      // Scroll only within the messages container, not the entire window
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setShowList(false);
    setShowChat(true);
    
    // Join the room via Socket.IO (only if connected)
    if (socket && isSocketConnected && user && user.id) {
      console.log('Joining room:', room.productId, 'as user:', user.id);
      socket.emit('joinRoom', { 
        userId: user.id, 
        productId: room.productId 
      });
      
      // Add current user to online users for this room
      setOnlineUsers(prev => {
        const newSet = new Set([...prev, user.id]);
        console.log('Added current user to online users:', Array.from(newSet));
        return newSet;
      });
    } else {
      console.log('Cannot join room - Socket not connected or user not available');
      console.log('Socket connected:', isSocketConnected, 'User:', user && user.id);
    }
  };

  const handleBackToList = () => {
    setShowList(true);
    setShowChat(false);
  };

  const handleLeaveChat = () => {
    if (!selectedRoom || !user || !user.id) return;
    setShowLeaveModal(true);
  };

  const handleLeaveCancel = () => {
    setShowLeaveModal(false);
  };

  const handleLeaveConfirm = async () => {
    if (!selectedRoom || !user || !user.id) return;
    
    setLeaveLoading(true);
    try {
      // 1. API를 통해 채팅방 나가기
      const response = await chatService.leaveChatRoom(selectedRoom.id);
      
      if (response.data && response.data.success) {
        // 2. Socket.IO에서 방 나가기
        if (socket && isSocketConnected) {
          socket.emit('leaveRoom', { 
            userId: user.id, 
            productId: selectedRoom.productId 
          });
        }
        
        // 3. Remove current user from online users
        setOnlineUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(user.id);
          return newSet;
        });
        
        // 4. 채팅방 목록에서 제거 (하지만 데이터는 보존)
        setChatRooms(prev => prev.filter(room => room.id !== selectedRoom.id));
        
        // 5. Clear current room and messages
        setSelectedRoom(null);
        setMessages([]);
        
        // 6. Go back to chat list
        setShowList(true);
        setShowChat(false);
        
        // 7. Show success message
        if (response.data.deleted) {
          console.log('채팅방이 완전히 삭제되었습니다.');
        } else {
          console.log('채팅방을 나갔습니다. 상대방이 다시 참여할 수 있습니다.');
        }
      }
    } catch (error) {
      console.error('Failed to leave chat room:', error);
      // Show error message to user
      alert('채팅방 나가기에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLeaveLoading(false);
      setShowLeaveModal(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedRoom) return;

    const tempId = Date.now();
    const messageText = currentMessage;
    setCurrentMessage(''); // Clear input immediately for better UX

    // Optimistically add message to UI
    const optimisticMessage = {
      id: tempId,
      text: messageText,
      isOwn: true,
      timestamp: new Date().toISOString(),
              sender: user && user.name
    };

    setMessages(prev => [...prev, optimisticMessage]);
    
    // Scroll to bottom after adding optimistic message
    setTimeout(() => {
      scrollToBottom();
    }, 100);

    try {
      // Send message via Socket.IO for real-time delivery
      if (socket && isSocketConnected) {
        socket.emit('sendMessage', {
          message: messageText,
          senderId: user && user.id,
          productId: selectedRoom.productId
        });
      }
      
      // Also send to API for persistence
      const response = await chatService.sendMessage(selectedRoom.id, {
        message: messageText
      });

      if (response.data && response.data.success) {
        // Replace optimistic message with real one
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? {
                  ...msg,
                  id: response.data.data.id,
                  timestamp: response.data.data.createdAt || response.data.data.timestamp
                }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      // Remove failed message from UI
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper function to safely format timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return '방금 전';
      }
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 1) return '방금 전';
      if (diffMins < 60) return `${diffMins}분 전`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}시간 전`;
      
      return date.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return '시간 미상';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return '';
      }
      
      return date.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price) + '원';
  };

  return (
    <Container>
      <ChatList showList={showList}>
        <ChatListHeader>
          <ChatListTitle>
            {searchParams.get('productId') ? '상품 채팅' : '채팅'}
          </ChatListTitle>
          {searchParams.get('productId') && (
            <div style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>
              특정 상품과 관련된 채팅만 표시됩니다
            </div>
          )}
        </ChatListHeader>
        
        <ChatRooms>
          {(() => {
            // Show error message if there's an error
            if (error) {
              return (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#e74c3c',
                  fontSize: '0.9rem',
                  backgroundColor: '#fdf2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  margin: '1rem'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    오류가 발생했습니다
                  </div>
                  <div>{error}</div>
                  <button 
                    onClick={() => window.location.reload()} 
                    style={{
                      marginTop: '1rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    다시 시도
                  </button>
                </div>
              );
            }
            
            const targetProductId = searchParams.get('productId');
            const filteredRooms = chatRooms.filter(room => {
              // productId 파라미터가 있으면 해당 상품과 관련된 채팅방만 표시
              return !targetProductId || room.productId === parseInt(targetProductId);
            });
            
            if (filteredRooms.length === 0) {
              return (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  {targetProductId 
                    ? '이 상품에 대한 채팅이 없습니다.' 
                    : '채팅방이 없습니다.'
                  }
                </div>
              );
            }
            
            return filteredRooms.map(room => (
            <ChatRoomItem
              key={`${room.id}-${room.productId}`}
              active={selectedRoom && selectedRoom.id === room.id}
              onClick={() => selectRoom(room)}
            >
              <ChatRoomHeader>
                <ChatRoomName>{room.partnerName}</ChatRoomName>
                <ChatRoomTime>{room.lastTime}</ChatRoomTime>
              </ChatRoomHeader>
              <ChatRoomPreview>{room.lastMessage}</ChatRoomPreview>
              
              <ProductCard>
                <ProductImage image={getImageUrl(room.productImage)} />
                <ProductInfo>
                  <ProductTitle>{room.productTitle}</ProductTitle>
                  <ProductPrice>{formatPrice(room.productPrice)}</ProductPrice>
                </ProductInfo>
              </ProductCard>
            </ChatRoomItem>
            ));
          })()}
        </ChatRooms>
      </ChatList>

      <ChatArea showChat={showChat}>
        {selectedRoom ? (
          <>
            <ChatHeader>
              <ChatHeaderLeft>
                <BackButton onClick={handleBackToList}>
                  <FiArrowLeft />
                </BackButton>
                <ChatPartner>
                  <PartnerName>{selectedRoom.partnerName}</PartnerName>
                  <PartnerStatus>
                    {!isSocketConnected ? '연결 중...' : 
                     onlineUsers.has(selectedRoom.partnerId) ? '온라인' : '오프라인'}
                  </PartnerStatus>
                </ChatPartner>
              </ChatHeaderLeft>
              
              <ChatHeaderRight>
                <HeaderButton onClick={handleLeaveChat} title="채팅 나가기">
                  <FiLogOut />
                </HeaderButton>
                <HeaderButton>
                  <FiMoreHorizontal />
                </HeaderButton>
              </ChatHeaderRight>
            </ChatHeader>

            <MessagesContainer ref={messagesContainerRef}>
              {selectedRoom && (
                <ProductCard>
                  <ProductImage image={getImageUrl(selectedRoom.productImage)} />
                  <ProductInfo>
                    <ProductTitle>{selectedRoom.productTitle}</ProductTitle>
                    <ProductPrice>{formatPrice(selectedRoom.productPrice)}</ProductPrice>
                  </ProductInfo>
                </ProductCard>
              )}
              
              {messages.map((message) => (
                <MessageGroup key={message.id} isOwn={message.isOwn}>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
                    {!message.isOwn && <MessageTime>{formatTime(message.timestamp)}</MessageTime>}
                    <Message isOwn={message.isOwn}>
                      {message.text}
                    </Message>
                    {message.isOwn && <MessageTime>{formatTime(message.timestamp)}</MessageTime>}
                  </div>
                </MessageGroup>
              ))}
              <div ref={messagesEndRef} />
            </MessagesContainer>

            <MessageInput>
              <AttachButton>
                <FiImage />
              </AttachButton>
              <InputField
                type="text"
                placeholder="메시지를 입력하세요..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <SendButton 
                onClick={handleSendMessage}
                disabled={!currentMessage.trim()}
              >
                <FiSend />
              </SendButton>
            </MessageInput>
          </>
        ) : (
          <EmptyState>
            <h3>채팅을 선택해주세요</h3>
            <p>왼쪽에서 채팅방을 선택하면 대화를 시작할 수 있습니다</p>
          </EmptyState>
        )}
      </ChatArea>

      {/* Leave Chat Modal */}
      <LeaveModal show={showLeaveModal}>
        <LeaveModalContent>
          <LeaveModalTitle>채팅방 나가기</LeaveModalTitle>
          <LeaveModalMessage>
            정말로 이 채팅방을 나가시겠습니까?<br />
            <br />
            ⚠️ 주의: 상대방도 채팅방을 나가면 모든 채팅 기록이 영구적으로 삭제됩니다.<br />
            나가기 후에는 채팅 기록을 복구할 수 없습니다.
          </LeaveModalMessage>
          <LeaveModalButtons>
            <CancelButton onClick={handleLeaveCancel}>
              취소
            </CancelButton>
            <ConfirmLeaveButton 
              onClick={handleLeaveConfirm}
              disabled={leaveLoading}
            >
              {leaveLoading ? '나가는 중...' : '나가기'}
            </ConfirmLeaveButton>
          </LeaveModalButtons>
        </LeaveModalContent>
      </LeaveModal>
    </Container>
  );
};

export default ChatPage;