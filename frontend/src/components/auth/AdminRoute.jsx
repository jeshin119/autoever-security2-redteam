import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const AdminRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="권한 확인 중..." />;
  }

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  // 관리자가 아닌 경우 홈으로 리다이렉트
  if (!user || user.role !== 'admin') {
    return <Redirect to="/" />;
  }

  return (
    <Route
      {...rest}
      render={props => <Component {...props} />}
    />
  );
};

export default AdminRoute;
