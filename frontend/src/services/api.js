import axios from "axios";
import { toast } from "react-toastify";

// API base URL configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://192.168.201.102:3001/api";

// Backend base URL for images (without /api)
const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://192.168.201.102:3001";

// Utility function to get proper image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already an array, get the first image
  if (Array.isArray(imagePath)) {
    if (imagePath.length > 0) {
      imagePath = imagePath[0];
    } else {
      return null;
    }
  }

  // If it's a JSON string (array), parse it and get the first image
  if (typeof imagePath === 'string' && imagePath.startsWith('[')) {
    try {
      const images = JSON.parse(imagePath);
      if (Array.isArray(images) && images.length > 0) {
        imagePath = images[0];
      } else {
        return null;
      }
    } catch (e) {
      console.error('Error parsing image JSON:', e);
      return null;
    }
  }

  // Ensure imagePath is a string before calling startsWith
  if (typeof imagePath !== 'string') {
    console.error('imagePath is not a string:', imagePath);
    return null;
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // If it starts with /uploads, construct the full URL with proper encoding
  if (imagePath.startsWith("/uploads")) {
    // Encode Korean characters in the path
    const encodedPath = imagePath.split('/').map(segment => 
      segment === 'uploads' ? segment : encodeURIComponent(segment)
    ).join('/');
    return `${BACKEND_BASE_URL}${encodedPath}`;
  }

  // If it's just a filename, assume it's in uploads
  return `${BACKEND_BASE_URL}/uploads/${encodeURIComponent(imagePath)}`;
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

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Intentionally vulnerable: Detailed error exposure
    const message = (error.response && error.response.data && error.response.data.message) || error.message;

    if (error.response && error.response.status === 401) {
      // Intentionally vulnerable: No secure logout
      localStorage.removeItem("token");
      
      // 로그인 페이지에서는 리다이렉트하지 않음 (에러 메시지 표시를 위해)
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    if (error.response && error.response.status === 500) {
      // 서버 에러 로그는 콘솔에만 기록
      console.error("Server Error:", error.response.data);
      // 사용자에게는 일반적인 메시지 표시
      toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
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
  chargeCredits: (userId, amount) => api.post(`/users/${userId}/charge-credits`, { amount }),
};

// Product Service
// export const productService = {
//   getProducts: (params = {}) => api.get("/products", { params }),
//   getProduct: (productId) => api.get(`/products/${productId}`),
//   createProduct: (productData) => api.post("/products", productData),
//   updateProduct: (productId, updateData) =>
//     api.put(`/products/${productId}`, updateData),
//   deleteProduct: (productId) => api.delete(`/products/${productId}`),
//   getUserProducts: (userId) => api.get(`/users/${userId}/products`),
//   searchProducts: (params = {}) => api.get("/products/search", { params }),
//   likeProduct: (productId) => api.post(`/products/${productId}/like`),
//   unlikeProduct: (productId) => api.delete(`/products/${productId}/like`),
//   checkLikeStatus: (productId) => api.get(`/products/${productId}/like`),
//   getUserLikedProducts: () => api.get("/products/user/liked"),
// };

export const productService = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getProduct: (productId) => api.get(`/products/${productId}`),
  createProduct: (productData, imageFiles = []) => {
    // 파일이 있으면 FormData로 전송
    if (imageFiles && imageFiles.length) {
      const fd = new FormData();
      // 파일 필드
      imageFiles.forEach((img) => {
        fd.append("images", img.file || img); // img.file이 File 객체
      });
      // 나머지 필드(문자열로 넣어도 multer가 body로 잘 받습니다)
      Object.entries(productData).forEach(([k, v]) => {
        // 배열/객체는 문자열로
        if (typeof v === "object") {
          fd.append(k, JSON.stringify(v));
        } else {
          fd.append(k, `${v}`);
        }
      });
      return api.post("/products", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    // 파일 없으면 기존처럼 JSON
    return api.post("/products", productData);
  },
  updateProduct: (productId, updateData, imageFiles = []) => {
    if (imageFiles && imageFiles.length) {
      const fd = new FormData();
      imageFiles.forEach((img) => {
        fd.append("images", img.file || img);
      });
      Object.entries(updateData).forEach(([k, v]) => {
        if (typeof v === "object") {
          fd.append(k, JSON.stringify(v));
        } else {
          fd.append(k, `${v}`);
        }
      });
      return api.put(`/products/${productId}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/products/${productId}`, updateData);
  },
  deleteProduct: (productId) => api.delete(`/products/${productId}`),
  getUserProducts: (userId) => api.get(`/users/${userId}/products`),
  searchProducts: (params = {}) => api.get("/products/search", { params }),
  likeProduct: (productId) => api.post(`/products/${productId}/like`),
  unlikeProduct: (productId) => api.delete(`/products/${productId}/like`),
  checkLikeStatus: (productId) => api.get(`/products/${productId}/like`),
  getUserLikedProducts: () => api.get("/products/user/liked"),
  purchaseProduct: (productId, paymentData = {}) => api.post(`/products/${productId}/purchase`, paymentData),
  validateCoupon: (couponCode, productPrice) => api.post("/products/validate-coupon", { couponCode, productPrice }),
  getUserCoupons: () => api.get("/products/user/coupons"),
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
  getOrCreateChatRoom: (targetUserId, targetProductId) =>
    api.post("/chat/rooms/get-or-create", { targetUserId, targetProductId }),
  leaveChatRoom: (roomId) =>
    api.post(`/chat/rooms/${roomId}/leave`),
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
  updatePost: (postId, postData) => api.put(`/community/posts/${postId}`, postData),
  deletePost: (postId) => api.delete(`/community/posts/${postId}`),
  
  // 댓글 관련
  createComment: (postId, commentData) => api.post(`/community/posts/${postId}/comments`, commentData),
  deleteComment: (commentId) => api.delete(`/community/comments/${commentId}`),
  
  // 게시글 좋아요 관련
  togglePostLike: (postId) => api.post(`/community/posts/${postId}/like`),
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
  deleteFile: (filename) => {
    return api.delete("/upload/file", {
      data: { filename }
    });
  },
};

export const downloadService = {
  downloadFile: async (filePath, fileName) => {
    const response = await api.get('/download', {
      params: { file: filePath },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName || filePath.split('/').pop() || 'downloaded-file');
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }
};

export default api;
