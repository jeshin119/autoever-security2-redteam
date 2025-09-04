import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiBell, FiMessageCircle, FiHeart, FiShoppingCart, FiCheck, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.colors.border};
  background: white;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const NotificationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: ${props => props.theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const NotificationItem = styled.div`
  background: ${props => props.read ? 'white' : props.theme.colors.backgroundSecondary};
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const NotificationIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => {
    switch(props.type) {
      case 'message': return '#007bff';
      case 'like': return '#dc3545';
      case 'purchase': return '#28a745';
      case 'system': return '#6c757d';
      default: return '#6c757d';
    }
  }};
  color: white;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.25rem 0;
`;

const NotificationMessage = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const NotificationTime = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const NotificationActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  color: ${props => props.theme.colors.textSecondary};
  
  &:hover {
    background: ${props => props.theme.colors.backgroundSecondary};
  }
`;

const UnreadBadge = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.primary};
  border-radius: 50%;
  margin-left: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.colors.textSecondary};
  
  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
`;

const NotificationPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock notification data
  const mockNotifications = [
    {
      id: 1,
      type: 'message',
      title: '새 메시지',
      message: '김철수님이 메시지를 보냈습니다: "내일 오후 3시에 만나시나요?"',
      time: '5분 전',
      read: false
    },
    {
      id: 2,
      type: 'like',
      title: '천 알림',
      message: '누군가가 당신의 "아이폰 14 Pro" 상품을 천했습니다.',
      time: '1시간 전',
      read: false
    },
    {
      id: 3,
      type: 'purchase',
      title: '거래 완료',
      message: '"북유럽 원목 식탁" 거래가 완료되었습니다. 구매자에게 후기를 남겨주세요!',
      time: '3시간 전',
      read: true
    },
    {
      id: 4,
      type: 'system',
      title: '시스템 알림',
      message: '매너 온도가 업데이트되었습니다. 현재 36.5점입니다.',
      time: '1일 전',
      read: true
    }
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'message': return <FiMessageCircle />;
      case 'like': return <FiHeart />;
      case 'purchase': return <FiShoppingCart />;
      default: return <FiBell />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          알림을 불러오는 중...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>
          알림
          {unreadCount > 0 && <UnreadBadge />}
        </Title>
        <HeaderActions>
          {unreadCount > 0 && (
            <ActionButton onClick={markAllAsRead}>
              <FiCheck size={14} />
              모두 읽음
            </ActionButton>
          )}
        </HeaderActions>
      </Header>

      {notifications.length === 0 ? (
        <EmptyState>
          <div className="icon">
            <FiBell />
          </div>
          <h3>알림이 없습니다</h3>
          <p>새로운 알림이 도착하면 여기에 표시됩니다</p>
        </EmptyState>
      ) : (
        <NotificationList>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              read={notification.read}
              onClick={() => markAsRead(notification.id)}
            >
              <NotificationIcon type={notification.type}>
                {getNotificationIcon(notification.type)}
              </NotificationIcon>
              
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
                <NotificationTime>{notification.time}</NotificationTime>
              </NotificationContent>
              
              <NotificationActions>
                {!notification.read && (
                  <IconButton onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id);
                  }}>
                    <FiCheck size={16} />
                  </IconButton>
                )}
                <IconButton onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}>
                  <FiTrash2 size={16} />
                </IconButton>
              </NotificationActions>
            </NotificationItem>
          ))}
        </NotificationList>
      )}
    </Container>
  );
};

export default NotificationPage;
