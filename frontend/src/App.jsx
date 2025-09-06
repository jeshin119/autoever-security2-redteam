import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
const PurchaseSuccessPage = lazy(() => import('./pages/PurchaseSuccessPage'));
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
          <Switch>
            {/* Public Routes */}
            <Route exact path="/" component={HomePage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/products" component={ProductListPage} />
            <Route exact path="/community" component={CommunityPage} />
            <PrivateRoute exact path="/community/new" component={CommunityPostCreatePage} />
            <PrivateRoute exact path="/community/:id/edit" component={CommunityPostCreatePage} />
            <Route exact path="/community/:id" component={CommunityPostDetailPage} />
            <Route exact path="/community/posts/:postId" component={CommunityPostDetailPage} />
            <Route exact path="/search" component={SearchPage} />
            <Route exact path="/users/:userId" component={ProfilePage} />
            
            {/* Private Routes */}
            <PrivateRoute exact path="/products/new" component={ProductCreatePage} />
            <PrivateRoute exact path="/products/:id/edit" component={ProductCreatePage} />
            <Route exact path="/products/:id" component={ProductDetailPage} />
            <PrivateRoute exact path="/my" component={MyPage} />
            <PrivateRoute exact path="/chat" component={ChatPage} />
            <PrivateRoute exact path="/chat/:roomId" component={ChatPage} />
            <PrivateRoute exact path="/transactions" component={TransactionPage} />
            <PrivateRoute exact path="/notifications" component={NotificationPage} />
            
            {/* Admin Routes */}
            <AdminRoute exact path="/admin" component={AdminPage} />
            <AdminRoute exact path="/admin/users" component={UserManagementPage} />
            <AdminRoute exact path="/admin/products" component={ProductManagementPage} />
            <AdminRoute exact path="/admin/transactions" component={TransactionManagementPage} />
            <AdminRoute exact path="/admin/settings" component={SystemSettingsPage} />
            
            {/* 404 Redirect */}
            <Route path="*" render={() => <Redirect to="/" />} />
          </Switch>
        </Suspense>
      </MainContent>
      <Footer />
    </AppContainer>
  );
};

export default App;