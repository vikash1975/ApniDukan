import axios from 'axios';

// Create axios instance with dynamic base URL
// Uses environment variable VITE_API_URL if available, otherwise falls back to localhost
const API = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
   baseURL: 'https://apnidukan-backend-tb6e.onrender.com/api',
});

// Add token to requests if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== PRODUCTS ====================
export const getAllProducts = () => API.get('/products');

export const getProductById = (id) => API.get(`/products/${id}`);

export const getFilteredProducts = (params) =>
  API.get('/product', { params });

// ==================== USERS ====================
export const userSignup = (data) => API.post('/users/signup', data);

export const userLogin = (data) => API.post('/users/login', data);

// ==================== ADMIN ====================
export const adminSignup = (data) => API.post('/admin/signup', data);

export const adminLogin = (data) => API.post('/admin/login', data);

// ==================== ADMIN PRODUCTS ====================
export const addProduct = (data) => API.post('/admin/product', data, {
  headers: { 'Content-Type': 'multipart/form-data' },
});

export const updateProduct = (id, data) => 
  API.put(`/admin/product/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProduct = (id) => API.delete(`/admin/product/${id}`);

// ==================== CART ====================
export const getCart = () => API.get('/cart');

export const addToCart = (data) => API.post('/cart/add', data);

export const removeFromCart = (productId) => API.delete(`/cart/${productId}`);

export const updateCartQuantity = (productId, data) => 
  API.put(`/cart/${productId}`, data);

export const clearCart = () => API.delete('/cart');

// ==================== CHECKOUT ====================
export const checkout = (data) => API.post('/orders', data);

export const getUserOrders = () => API.get('/orders');

export const getOrderById = (orderId) => API.get(`/orders/${orderId}`);

export const cancelOrder = (orderId) => API.put(`/orders/${orderId}/cancel`);

// ==================== ADMIN ORDERS ====================
export const getAllOrders = () => API.get('/orders/admin/all');

export const updateOrderStatus = (orderId, status) => 
  API.put(`/orders/${orderId}/status`, { status });

// ==================== PAYMENT ====================
export const processPayment = (orderId, data) => 
  API.post('/payment/process', { orderId, ...data });

export const getPaymentStatus = (orderId) => 
  API.get(`/payment/${orderId}`);

// ==================== RAZORPAY ====================
export const getRazorpayKey = () => API.get('/razorpay/key');

export const createRazorpayOrder = (amount) => 
  API.post('/razorpay/create-order', { amount });

export const verifyRazorpayPayment = (data) => 
  API.post('/razorpay/verify-payment', data);

export const handleRazorpayFailure = (data) => 
  API.post('/razorpay/payment-failure', data);

export default API;
