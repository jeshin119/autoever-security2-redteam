import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiSend, FiImage, FiArrowLeft, FiMoreHorizontal } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { chatService, getImageUrl } from '../services/api';

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

const ChatPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { user } = useAuth();
  const [showList, setShowList] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat rooms on component mount
  useEffect(() => {
    const loadChatRooms = async () => {
      try {
        setLoading(true);
        const response = await chatService.getChatRooms();
        
        if (response.data && response.data.success) {
          const rooms = response.data.data.map(room => ({
            id: room.id,
            partnerName: room.name,
            lastMessage: room.lastMessage,
            lastTime: formatTimestamp(room.timestamp),
            unreadCount: room.unreadCount || 0,
            productTitle: room.productTitle,
            productPrice: null,
            productImage: null
          }));
          setChatRooms(rooms);
        }
      } catch (error) {
        console.error('Failed to load chat rooms:', error);
        // Fall back to mock data if API fails
        setChatRooms([
          {
            id: 1,
            partnerName: '김철수',
            lastMessage: '안녕하세요! 아이폰 상태가 어떤가요?',
            lastTime: formatTimestamp(new Date()),
            unreadCount: 2,
            productTitle: '아이폰 14 Pro 128GB',
            productPrice: 950000,
            productImage: null
          },
          {
            id: 2,
            partnerName: '이영희',
            lastMessage: '네, 내일 직거래 가능할까요?',
            lastTime: formatTimestamp(new Date(Date.now() - 3600000)),
            unreadCount: 0,
            productTitle: '북유럽 원목 식탁',
            productPrice: 150000,
            productImage: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadChatRooms();
  }, []);

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
          const msgs = response.data.data.map(msg => ({
            id: msg.id,
            text: msg.message,
            isOwn: msg.senderId === (user && user.id),
            timestamp: msg.timestamp,
            sender: msg.senderId === (user && user.id) ? user.name : selectedRoom.partnerName
          }));
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setShowList(false);
    setShowChat(true);
  };

  const handleBackToList = () => {
    setShowList(true);
    setShowChat(false);
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

    try {
      // Send message to API
      const response = await chatService.sendMessage(selectedRoom.id, {
        message: messageText,
        senderId: (user && user.id) || 1 // Default to 1 if no user
      });

      if (response.data && response.data.success) {
        // Replace optimistic message with real one
        setMessages(prev => 
          prev.map(msg => 
            msg.id === tempId 
              ? {
                  ...msg,
                  id: response.data.data.id,
                  timestamp: response.data.data.timestamp
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
          <ChatListTitle>채팅</ChatListTitle>
        </ChatListHeader>
        
        <ChatRooms>
          {chatRooms.map(room => (
            <ChatRoomItem
              key={room.id}
              active={selectedRoom && selectedRoom.id === room.id}
              onClick={() => selectRoom(room)}
            >
              <ChatRoomHeader>
                <ChatRoomName>{room.partnerName}</ChatRoomName>
                <ChatRoomTime>{room.lastTime}</ChatRoomTime>
              </ChatRoomHeader>
              <ChatRoomPreview>{room.lastMessage}</ChatRoomPreview>
              
              <ProductCard>
                <ProductImage image={room.productImage} />
                <ProductInfo>
                  <ProductTitle>{room.productTitle}</ProductTitle>
                  <ProductPrice>{formatPrice(room.productPrice)}</ProductPrice>
                </ProductInfo>
              </ProductCard>
            </ChatRoomItem>
          ))}
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
                  <PartnerStatus>온라인</PartnerStatus>
                </ChatPartner>
              </ChatHeaderLeft>
              
              <ChatHeaderRight>
                <HeaderButton>
                  <FiMoreHorizontal />
                </HeaderButton>
              </ChatHeaderRight>
            </ChatHeader>

            <MessagesContainer>
              {selectedRoom && (
                <ProductCard>
                  <ProductImage image={selectedRoom.productImage} />
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
    </Container>
  );
};

export default ChatPage;