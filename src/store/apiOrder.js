import axios from 'axios';

const BASE_URL = 'https://localhost:7130/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.warn('Không thể kết nối đến server');
      return Promise.resolve({ data: [] });
    }
    return Promise.reject(error);
  }
);

export const OrderAPI = {
  // Lấy tất cả đơn hàng với phân trang
  getAll: async (pageIndex = 1, pageSize = 10) => {
    try {
      const response = await api.get('/Order/get-all-orders', {
        params: {
          pageIndex,
          pageSize
        }
      });

      if (response?.data) {
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data.$values) return data.$values;
        if (data.data) return data.data;
      }
      
      return [];
    } catch (error) {
      console.warn('Lỗi khi lấy danh sách đơn hàng:', error.message);
      throw new Error('Không thể lấy danh sách đơn hàng');
    }
  },

  // Lấy chi tiết đơn hàng
  getDetail: async (orderId) => {
    try {
      const response = await api.get(`/Order/get-order-detail/${orderId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi lấy chi tiết đơn hàng:', error.message);
      throw new Error('Không thể lấy chi tiết đơn hàng');
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateStatus: async (orderId, status) => {
    try {
      const response = await api.patch(`/Order/update-status/${orderId}`, { status });
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi cập nhật trạng thái đơn hàng:', error.message);
      throw new Error('Không thể cập nhật trạng thái đơn hàng');
    }
  },

  // Hủy đơn hàng
  cancel: async (orderId) => {
    try {
      const response = await api.patch(`/Order/cancel-order/${orderId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi hủy đơn hàng:', error.message);
      throw new Error('Không thể hủy đơn hàng');
    }
  }
}; 