import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';
import PrivateRoute from './components/auth/PrivateRoute';
import AdminRoute from './components/auth/AdminRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProductListPage = lazy(() => import('./pages/ProductListPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const ProductCreatePage = lazy(() => import('./pages/ProductCreatePage'));
const CommunityPage = lazy(() => import('./pages/CommunityPage'));
const CommunityPostDetailPage = lazy(() => import('./pages/CommunityPostDetailPage'));
const CommunityPostCreatePage = lazy(() => import('./pages/CommunityPostCreatePage'));




const MyPage = lazy(() => import('./pages/MyPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const TransactionPage = lazy(() => import('./pages/TransactionPage'));
const NotificationPage = lazy(() => import('./pages/NotificationPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

// Lazy load admin management pages
const UserManagementPage = lazy(() => import('./pages/admin/UserManagementPage'));
const ProductManagementPage = lazy(() => import('./pages/admin/ProductManagementPage'));
const TransactionManagementPage = lazy(() => import('./pages/admin/TransactionManagementPage'));
const SystemSettingsPage = lazy(() => import('./pages/admin/SystemSettingsPage'));

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding-top: 60px; // Header height
  background: ${props => props.theme.colors.background};
`;

const App = () => {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/posts/:postId" element={<CommunityPostDetailPage />} />
            
            
            
            
            <Route path="/search" element={<SearchPage />} />
            <Route path="/users/:userId" element={<ProfilePage />} />
            
            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/products/new" element={<ProductCreatePage />} />
              <Route path="/products/:id/edit" element={<ProductCreatePage />} />
              <Route path="/community/new" element={<CommunityPostCreatePage />} />
              <Route path="/my" element={<MyPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/chat/:roomId" element={<ChatPage />} />
              <Route path="/transactions" element={<TransactionPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
            </Route>
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/users" element={
                <Suspense fallback={<LoadingSpinner fullScreen text="사용자 관리 페이지 로딩 중..." />}>
                  <UserManagementPage />
                </Suspense>
              } />
              <Route path="/admin/products" element={
                <Suspense fallback={<LoadingSpinner fullScreen text="상품 관리 페이지 로딩 중..." />}>
                  <ProductManagementPage />
                </Suspense>
              } />
              <Route path="/admin/transactions" element={
                <Suspense fallback={<LoadingSpinner fullScreen text="거래 관리 페이지 로딩 중..." />}>
                  <TransactionManagementPage />
                </Suspense>
              } />
              <Route path="/admin/settings" element={
                <Suspense fallback={<LoadingSpinner fullScreen text="시스템 설정 페이지 로딩 중..." />}>
                  <SystemSettingsPage />
                </Suspense>
              } />
            </Route>
            
            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </MainContent>
      <Footer />
    </AppContainer>
  );
};

export default App;