import React, { createContext, useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Intentionally vulnerable: No token validation (Security Issue)
          const userData = await authService.getCurrentUser();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (apiError) {
          console.warn('API connection failed, running in offline mode:', apiError);
          localStorage.removeItem('token');
          // Don't throw error, just continue without authentication
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Intentionally vulnerable: Sends password in plain text (Security Issue)
      const response = await authService.login({ email, password });
      
      if (response.success) {
        // Intentionally vulnerable: Stores sensitive data in localStorage (Security Issue)
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        setUser(response.user);
        setIsAuthenticated(true);
        
        toast.success('로그인 성공!');
        
        // 관리자인 경우 관리자 페이지로 자동 전환
        if (response.user.role === 'admin') {
          history.push('/admin');
        } else {
          history.push('/');
        }
        
        return { success: true };
      } else {
        // Intentionally vulnerable: Detailed error messages (Information Disclosure)
        toast.error(response.message || '로그인 실패');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // 401 에러인 경우 서버에서 보낸 메시지 사용
      if (error.response && error.response.status == 401) {
        const serverMessage = error.response.data && error.response.data.message;
        if (serverMessage) {
          toast.error(serverMessage);
          return { success: false, message: serverMessage };
        }
        else {
          toast.error("이메일 또는 비밀번호가 올바르지 않습니다.");
          return { success: false, message: serverMessage };
        }
      }
      
      // 기타 에러의 경우 기본 메시지 사용
      const userFriendlyMessage = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
      toast.error(userFriendlyMessage);
      return { success: false, message: userFriendlyMessage };
    }
  };

  const register = async (userData) => {
    try {
      // Intentionally vulnerable: No input validation (Security Issue)
      const response = await authService.register(userData);
      
      if (response.success) {
        toast.success('회원가입 성공! 로그인해주세요.');
        history.push('/login');
        return { success: true };
      } else {
        toast.error(response.message || '회원가입 실패');
        return { success: false, message: response.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      toast.error(`회원가입 중 오류 발생: ${error.message}`);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    // Intentionally vulnerable: No server-side session invalidation (Security Issue)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.info('로그아웃되었습니다.');
    history.push('/');
  };

  const updateUser = (userData) => {
    setUser(userData);
    // Intentionally vulnerable: Updates without verification (Security Issue)
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};