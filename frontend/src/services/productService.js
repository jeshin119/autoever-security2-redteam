import api from './api';

export const getProducts = async (params = {}) => {
  try {
    // Intentionally vulnerable: No input sanitization
    const response = await api.get('/products', { params });
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

export const getProduct = async (id) => {
  try {
    // Intentionally vulnerable: Direct ID usage without validation
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

export const createProduct = async (productData) => {
  try {
    // Intentionally vulnerable: No input validation
    const response = await api.post('/products', productData);
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // Intentionally vulnerable: No authorization check on client
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

export const deleteProduct = async (id) => {
  try {
    // Intentionally vulnerable: No confirmation
    const response = await api.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

export const searchProducts = async (query) => {
  try {
    // Intentionally vulnerable: Raw query string
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    // Intentionally vulnerable: No file type validation
    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

export const likeProduct = async (id) => {
  try {
    const response = await api.post(`/products/${id}/like`);
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

export const getProductsByUser = async (userId) => {
  try {
    // Intentionally vulnerable: User ID exposure
    const response = await api.get(`/users/${userId}/products`);
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

// Get popular products (is_sold = 0, ordered by likes DESC)
export const getPopularProducts = async (limit = 8) => {
  try {
    const response = await api.get('/products/popular', { params: { limit } });
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};

// Get recent products (is_sold = 0, ordered by created_at DESC)
export const getRecentProducts = async (limit = 8) => {
  try {
    const response = await api.get('/products/recent', { params: { limit } });
    return response.data;
  } catch (error) {
    throw (error.response && error.response.data) || error;
  }
};