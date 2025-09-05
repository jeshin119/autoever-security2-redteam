import React, { useState, useEffect, useRef } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from '../common/SearchBar';
import NotificationBadge from '../common/NotificationBadge';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${props => props.theme.colors.backgroundPaper};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  z-index: ${props => props.theme.zIndex.fixed};
  box-shadow: ${props => props.theme.shadows.sm};
`;

const HeaderContent = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
  
  span {
    color: ${props => props.theme.colors.text};
    font-size: 1rem;
    font-weight: 400;
  }
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.lg};
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.primary};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
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
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

const Button = styled(Link)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary};
  color: white;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserAvatar = styled.button`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.full};
  overflow: hidden;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  cursor: pointer;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: ${props => props.theme.colors.backgroundPaper};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  box-shadow: ${props => props.theme.shadows.lg};
  min-width: 200px;
  padding: ${props => props.theme.spacing.sm};
  display: ${props => props.show ? 'block' : 'none'};
  z-index: ${props => props.theme.zIndex.dropdown};
`;

const MenuItem = styled(Link)`
  display: block;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const MenuDivider = styled.hr`
  margin: ${props => props.theme.spacing.sm} 0;
  border: none;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const MenuButton = styled.button`
  display: block;
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  color: ${props => props.theme.colors.text};
  border-radius: ${props => props.theme.borderRadius.sm};
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }
`;

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const history = useHistory();
  const userMenuRef = useRef(null);

  // 외부 클릭 감지하여 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    // 드롭다운이 열려있을 때만 이벤트 리스너 추가
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    // 클린업 함수
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <NavSection>
          <Logo to="/">
            🛒 Vintage Market
            <span>빈티지 중고거래</span>
          </Logo>
          
          <NavLinks>
            <NavLink to="/products">중고거래</NavLink>
            <NavLink to="/community">동네생활</NavLink>
          </NavLinks>
        </NavSection>

        <SearchBar />

        <UserSection>
          <IconButton onClick={toggleTheme} title="테마 변경">
            {isDarkMode ? '🌙' : '☀️'}
          </IconButton>

          {isAuthenticated ? (
            <>
              <NotificationBadge />
              <IconButton onClick={() => history.push('/chat')} title="채팅">
                💬
              </IconButton>
              
              <UserMenu ref={userMenuRef}>
                <UserAvatar onClick={() => setShowUserMenu(!showUserMenu)}>
                  {user && user.profileImage ? (
                    <img src={user.profileImage} alt={user.name} />
                  ) : (
                    (user && user.name && user.name.charAt(0).toUpperCase()) || 'U'
                  )}
                </UserAvatar>
                
                <DropdownMenu show={showUserMenu}>
                  <MenuItem to="/my" onClick={() => setShowUserMenu(false)}>내 정보</MenuItem>
                  <MenuItem to="/products/new" onClick={() => setShowUserMenu(false)}>판매하기</MenuItem>
                  <MenuButton onClick={() => { history.push('/transactions'); setShowUserMenu(false); }}>거래내역</MenuButton>
                  <MenuDivider />
                  <MenuButton onClick={() => { history.push('/my/products'); setShowUserMenu(false); }}>내 상품 관리</MenuButton>
                  <MenuButton onClick={() => { history.push('/my/likes'); setShowUserMenu(false); }}>관심목록</MenuButton>
                  <MenuButton onClick={() => { history.push('/my/reviews'); setShowUserMenu(false); }}>받은 후기</MenuButton>
                  {user && user.role === 'admin' && (
                    <>
                      <MenuDivider />
                      <MenuItem to="/admin" style={{ color: '#10b981', fontWeight: '600' }} onClick={() => setShowUserMenu(false)}>
                        🔧 관리자 페이지
                      </MenuItem>
                    </>
                  )}
                  <MenuDivider />
                  <MenuButton onClick={handleLogout}>
                    로그아웃
                  </MenuButton>
                </DropdownMenu>
              </UserMenu>
            </>
          ) : (
            <>
              <Button to="/login">로그인</Button>
              <Button to="/register">회원가입</Button>
            </>
          )}

          <MobileMenuButton>
            ☰
          </MobileMenuButton>
        </UserSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;