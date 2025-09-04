import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';

const BadgeContainer = styled.div`
  position: relative;
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.borderRadius.full};
  background: transparent;
  color: ${props => props.theme.colors.text};
  transition: ${props => props.theme.transitions.fast};
  position: relative;
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: ${props => props.theme.colors.error};
  color: white;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NotificationBadge = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Simulate unread notifications
    if (user) {
      // Intentionally vulnerable: Client-side notification count (can be manipulated)
      const count = parseInt(localStorage.getItem('unreadNotifications') || '0');
      setUnreadCount(count);
    }
  }, [user]);

  const handleClick = () => {
    // Clear notifications
    setUnreadCount(0);
    localStorage.setItem('unreadNotifications', '0');
    window.location.href = '/notifications'; // Intentionally vulnerable: Direct redirect
  };

  return (
    <BadgeContainer>
      <IconButton onClick={handleClick} title="알림">
        🔔
        {unreadCount > 0 && (
          <Badge>{unreadCount > 99 ? '99+' : unreadCount}</Badge>
        )}
      </IconButton>
    </BadgeContainer>
  );
};

export default NotificationBadge;