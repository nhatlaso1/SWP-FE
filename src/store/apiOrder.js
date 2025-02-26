import axios from 'axios';

const BASE_URL = 'https://localhost:7130/api/Order';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/';
    }
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.warn('Cannot connect to server');
      return Promise.resolve({ data: { $values: [] } });
    }
    return Promise.reject(error);
  }
);

export const OrderAPI = {
  // Get all orders
  getAll: async () => {
    try {
      console.log('Calling API get_all_order...');
      const response = await api.get('/get_all_order');
      console.log('API Response:', response.data);
      const orders = response.data.$values || [];
      console.log('Processed Orders:', orders);
      return orders.map(order => ({
        id: order.orderId,
        customerName: order.details.$values[0]?.productName || 'Unknown',
        date: order.createdDate,
        total: order.totalAmount,
        status: order.status,
        details: order.details.$values.map(detail => ({
          id: detail.orderDetailId,
          productId: detail.productId,
          productName: detail.productName,
          size: detail.size,
          quantity: detail.quantity,
          price: detail.price,
          discount: detail.discount
        }))
      }));
    } catch (error) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  // Get order details
  getDetail: async (orderId) => {
    try {
      const response = await api.get(`/get-order-detail/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting order details:', error);
      throw error;
    }
  },

  // Update order status
  updateStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/update-status/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  // Cancel order
  cancel: async (orderId) => {
    try {
      const response = await api.patch(`/cancel-order/${orderId}`);
      return response.data;
    } catch (error) {
      console.error('Error canceling order:', error);
      throw error;
    }
  }
}; 