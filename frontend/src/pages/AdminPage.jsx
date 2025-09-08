import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useHistory, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { adminService } from '../services/api';

// Lazy load admin management pages
const UserManagementPage = lazy(() => import('./admin/UserManagementPage'));
const ProductManagementPage = lazy(() => import('./admin/ProductManagementPage'));
const TransactionManagementPage = lazy(() => import('./admin/TransactionManagementPage'));
const SystemSettingsPage = lazy(() => import('./admin/SystemSettingsPage'));

const AdminContainer = styled.div`
  min-height: calc(100vh - 60px);
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background};
`;

const AdminHeader = styled.div`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: ${props => props.theme.spacing.xl};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const AdminTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
`;

const AdminSubtitle = styled.p`
  margin: ${props => props.theme.spacing.sm} 0 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.theme.spacing.xl};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const AdminCard = styled.div`
  background: ${props => props.theme.colors.backgroundPaper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.lg};
  }
`;

const CardTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0 0 ${props => props.theme.spacing.md} 0;
  font-size: 1.3rem;
  font-weight: 600;
`;

const CardContent = styled.div`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.md};
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ActionButton = styled.button`
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.primaryDark};
  }
`;

const TableContainer = styled.div`
  background: ${props => props.theme.colors.backgroundPaper};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: ${props => props.theme.spacing.xl};
  box-shadow: ${props => props.theme.shadows.md};
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
  font-weight: 600;
`;

const Td = styled.td`
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.text};
`;

const StatusBadge = styled.span`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.role === 'admin' ? '#10b981' : '#6b7280'};
  color: white;
`;

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const history = useHistory();
  const [currentView, setCurrentView] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalTransactions: 0,
    pageViews: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // 관리자가 아닌 경우 홈으로 리다이렉트
    if (isAuthenticated && user && user.role !== 'admin') {
      toast.error('관리자만 접근할 수 있습니다.');
      history.push('/');
      return;
    }

    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      history.push('/login');
      return;
    }

    // 관리자 통계 및 데이터 로드
    loadAdminData();
  }, [isAuthenticated, user, history]);

  const loadAdminData = async () => {
    try {
      // 실제 API 호출로 데이터 가져오기
      const [statsResponse, usersResponse, productsResponse, transactionsResponse] = await Promise.all([
        adminService.getStats(),
        adminService.getRecentUsers(5),
        adminService.getRecentProducts(5),
        adminService.getRecentTransactions(5)
      ]);

      // 통계 데이터 설정
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // 최근 가입 사용자 설정
      if (usersResponse.success) {
        setRecentUsers(usersResponse.data);
      }

      // 최근 등록 상품 설정
      if (productsResponse.success) {
        setRecentProducts(productsResponse.data);
      }

      // 최근 거래 내역 설정
      if (transactionsResponse.success) {
        setRecentTransactions(transactionsResponse.data);
      }

    } catch (error) {
      console.error('Admin data loading error:', error);
      toast.error('관리자 데이터를 불러오는데 실패했습니다.');
    }
  };

  const handleUserManagement = () => {
    setCurrentView('users');
  };

  const handleProductManagement = () => {
    setCurrentView('products');
  };

  const handleTransactionManagement = () => {
    setCurrentView('transactions');
  };

  const handleSystemSettings = () => {
    setCurrentView('settings');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return null;
  }

  // Render different views based on currentView state
  if (currentView === 'users') {
    return (
      <Suspense fallback={<LoadingSpinner fullScreen text="사용자 관리 페이지 로딩 중..." />}>
        <UserManagementPage onBack={handleBackToDashboard} />
      </Suspense>
    );
  }
  
  if (currentView === 'products') {
    return (
      <Suspense fallback={<LoadingSpinner fullScreen text="상품 관리 페이지 로딩 중..." />}>
        <ProductManagementPage onBack={handleBackToDashboard} />
      </Suspense>
    );
  }
  
  if (currentView === 'transactions') {
    return (
      <Suspense fallback={<LoadingSpinner fullScreen text="거래 관리 페이지 로딩 중..." />}>
        <TransactionManagementPage onBack={handleBackToDashboard} />
      </Suspense>
    );
  }
  
  if (currentView === 'settings') {
    return (
      <Suspense fallback={<LoadingSpinner fullScreen text="시스템 설정 페이지 로딩 중..." />}>
        <SystemSettingsPage onBack={handleBackToDashboard} />
      </Suspense>
    );
  }

  return (
    <AdminContainer>
      <AdminHeader>
        <AdminTitle>🔧 관리자 대시보드</AdminTitle>
        <AdminSubtitle>
          안녕하세요, {user.name}님! Vintage Market의 관리자 페이지입니다.
        </AdminSubtitle>
      </AdminHeader>

      <AdminGrid>
        <AdminCard>
          <CardTitle>👥 전체 사용자</CardTitle>
          <StatNumber>{stats.totalUsers.toLocaleString()}</StatNumber>
          <CardContent>총 등록된 사용자 수</CardContent>
          <ActionButton onClick={handleUserManagement}>사용자 관리</ActionButton>
        </AdminCard>

        <AdminCard>
          <CardTitle>🛍️ 전체 상품</CardTitle>
          <StatNumber>{stats.totalProducts.toLocaleString()}</StatNumber>
          <CardContent>등록된 상품 수</CardContent>
          <ActionButton onClick={handleProductManagement}>상품 관리</ActionButton>
        </AdminCard>

        <AdminCard>
          <CardTitle>💰 전체 거래</CardTitle>
          <StatNumber>{stats.totalTransactions.toLocaleString()}</StatNumber>
          <CardContent>완료된 거래 수</CardContent>
          <ActionButton onClick={handleTransactionManagement}>거래 관리</ActionButton>
        </AdminCard>

        <AdminCard>
          <CardTitle>📊 페이지 방문수</CardTitle>
          <StatNumber>{stats.pageViews.toLocaleString()}</StatNumber>
          <CardContent>최근 30일 활동 사용자</CardContent>
          <ActionButton onClick={handleSystemSettings}>시스템 설정</ActionButton>
        </AdminCard>
      </AdminGrid>

      <TableContainer>
        <CardTitle>👥 최근 가입 사용자</CardTitle>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>이름</Th>
              <Th>이메일</Th>
              <Th>역할</Th>
              <Th>상태</Th>
              <Th>가입일</Th>
            </tr>
          </thead>
          <tbody>
            {recentUsers.map(user => (
              <tr key={user.id}>
                <Td>{user.id}</Td>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <StatusBadge role={user.role}>
                    {user.role === 'admin' ? '관리자' : '일반사용자'}
                  </StatusBadge>
                </Td>
                <Td>
                  <StatusBadge role={user.isActive ? 'admin' : 'user'}>
                    {user.isActive ? '활성' : '비활성'}
                  </StatusBadge>
                </Td>
                <Td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <TableContainer style={{ marginTop: '2rem' }}>
        <CardTitle>🛍️ 최근 등록 상품</CardTitle>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>상품명</Th>
              <Th>카테고리</Th>
              <Th>가격</Th>
              <Th>상태</Th>
              <Th>판매자</Th>
            </tr>
          </thead>
          <tbody>
            {recentProducts.map(product => (
              <tr key={product.id}>
                <Td>{product.id}</Td>
                <Td>{product.title}</Td>
                <Td>{product.category}</Td>
                <Td>₩{parseFloat(product.price).toLocaleString()}</Td>
                <Td>
                  <StatusBadge role={!product.isSold ? 'admin' : 'user'}>
                    {product.isSold ? '판매완료' : '판매중'}
                  </StatusBadge>
                </Td>
                <Td>{(product.User && product.User.name) || '판매자 정보 없음'}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      {/* 최근 거래 내역 */}
      <TableContainer>
        <CardTitle>💳 최근 거래 내역</CardTitle>
        <Table>
          <thead>
            <tr>
              <Th>거래ID</Th>
              <Th>상품명</Th>
              <Th>구매자</Th>
              <Th>판매자</Th>
              <Th>거래금액</Th>
              <Th>상태</Th>
              <Th>거래일시</Th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map(transaction => {
              // paymentData JSON에서 구매자/판매자 정보 추출
              let buyerName = '구매자 정보 없음';
              let sellerName = '판매자 정보 없음';
              
              try {
                if (transaction.paymentData) {
                  const paymentInfo = JSON.parse(transaction.paymentData);
                  buyerName = (paymentInfo.buyerInfo && paymentInfo.buyerInfo.name) || '구매자 정보 없음';
                  sellerName = (paymentInfo.sellerInfo && paymentInfo.sellerInfo.name) || '판매자 정보 없음';
                }
              } catch (error) {
                console.error('paymentData parsing error:', error);
              }
              
              return (
                <tr key={transaction.id}>
                  <Td>{transaction.id}</Td>
                  <Td>{(transaction.Product && transaction.Product.title) || '상품정보 없음'}</Td>
                  <Td>{buyerName}</Td>
                  <Td>{sellerName}</Td>
                  <Td>₩{parseFloat(transaction.amount).toLocaleString()}</Td>
                  <Td>
                    <StatusBadge role={transaction.status === 'completed' ? 'admin' : 'user'}>
                      {transaction.status === 'completed' ? '완료' : 
                       transaction.status === 'pending' ? '진행중' : 
                       transaction.status === 'cancelled' ? '취소' : '환불'}
                    </StatusBadge>
                  </Td>
                  <Td>{new Date(transaction.createdAt).toLocaleDateString('ko-KR')}</Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
    </AdminContainer>
  );
};

export default AdminPage;
