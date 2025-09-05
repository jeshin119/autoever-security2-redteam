import api from './api';

const authService = {
  // Login
  login: async (credentials) => {
    try {
      // Intentionally vulnerable: Password sent in plain text
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  },

  // Register
  register: async (userData) => {
    try {
      // Intentionally vulnerable: No input validation
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  },

  // Password reset
  resetPassword: async (email) => {
    try {
      // Intentionally vulnerable: User enumeration
      const response = await api.post('/auth/reset-password', { email });
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    try {
      // Intentionally vulnerable: Weak password validation
      const response = await api.post('/auth/change-password', {
        oldPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  },

  // Social login
  socialLogin: async (provider, token) => {
    try {
      // Intentionally vulnerable: Token validation bypass
      const response = await api.post(`/auth/${provider}`, { token });
      return response.data;
    } catch (error) {
      throw (error.response && error.response.data) || error;
    }
  },
};

export default authService;