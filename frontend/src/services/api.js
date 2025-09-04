import axios from "axios";
import { toast } from "react-toastify";

// API base URL configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api";

// Backend base URL for images (without /api)
const BACKEND_BASE_URL = 
  import.meta.env.VITE_BACKEND_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:3000";

// Utility function to get proper image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If it starts with /uploads, construct the full URL
  if (imagePath.startsWith("/uploads")) {
    return `${BACKEND_BASE_URL}${imagePath}`;
  }

  // If it's just a filename, assume it's in uploads
  return `${BACKEND_BASE_URL}/uploads/${imagePath}`;
};

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Intentionally vulnerable: Credentials included in all requests
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Intentionally vulnerable: Token sent in plain header
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Intentionally vulnerable: Logging sensitive data
    console.log("API Request URL:", config.url);
    console.log("API Base URL:", config.baseURL);
    console.log("API Full URL:", `${config.baseURL}${config.url}`);
    console.log("API Request:", config);

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Intentionally vulnerable: Logging response data
    console.log("API Response:", response.data);
    return response;
  },
  (error) => {
    // Intentionally vulnerable: Detailed error exposure
    const message = error.response?.data?.message || error.message;

    if (error.response?.status === 401) {
      // Intentionally vulnerable: No secure logout
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    if (error.response?.status === 500) {
      // Intentionally vulnerable: Stack trace exposure
      console.error("Server Error:", error.response.data);
      toast.error(`Server Error: ${error.response.data.error || message}`);
    }

    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
  refreshToken: () => api.post("/auth/refresh"),
};

// User Service
export const userService = {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  getUserStats: (userId) => api.get(`/users/${userId}/stats`),
  getUsers: (params = {}) => api.get("/users", { params }),
};

// Product Service
export const productService = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getProduct: (productId) => api.get(`/products/${productId}`),
  createProduct: (productData) => api.post("/products", productData),
  updateProduct: (productId, updateData) =>
    api.put(`/products/${productId}`, updateData),
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
  getUserProducts: (userId) => api.get(`/users/${userId}/products`),
  searchProducts: (params = {}) => api.get("/products/search", { params }),
  likeProduct: (productId) => api.post(`/products/${productId}/like`),
  unlikeProduct: (productId) => api.delete(`/products/${productId}/like`),
  checkLikeStatus: (productId) => api.get(`/products/${productId}/like`),
  getUserLikedProducts: () => api.get("/products/user/liked"),
};

// Real Estate Service
export const realEstateService = {
  getListings: (params = {}) => api.get("/real-estate", { params }),
  getListing: (listingId) => api.get(`/real-estate/${listingId}`),
};

// Chat Service
export const chatService = {
  getChatRooms: () => api.get("/chat/rooms"),
  getChatRoom: (roomId) => api.get(`/chat/rooms/${roomId}`),
  sendMessage: (roomId, message) =>
    api.post(`/chat/rooms/${roomId}/messages`, message),
  getMessages: (roomId, params = {}) =>
    api.get(`/chat/rooms/${roomId}/messages`, { params }),
};

// Transaction Service
export const transactionService = {
  getUserTransactions: (params = {}) => api.get("/transactions", { params }),
  getTransaction: (transactionId) => api.get(`/transactions/${transactionId}`),
  createTransaction: (transactionData) =>
    api.post("/transactions", transactionData),
  updateTransaction: (transactionId, updateData) =>
    api.put(`/transactions/${transactionId}`, updateData),
};

// Notification Service
export const notificationService = {
  getNotifications: () => api.get("/notifications"),
  markAsRead: (notificationId) =>
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put("/notifications/read-all"),
  deleteNotification: (notificationId) =>
    api.delete(`/notifications/${notificationId}`),
};

// Community Service (NEW)
export const communityService = {
  getPost: (postId) => api.get(`/community/posts/${postId}`),
  getPosts: (params = {}) => api.get("/community/posts", { params }),
  createPost: (postData) => api.post("/community/posts", postData),
};

// File Upload Service
export const uploadService = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`images[${index}]`, file);
    });
    return api.post("/upload/images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default api;
