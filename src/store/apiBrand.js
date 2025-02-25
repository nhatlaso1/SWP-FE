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

export const BrandAPI = {
  // Lấy tất cả nhãn hiệu
  getAll: async () => {
    try {
      const response = await api.get('/Brand/get-brands');
      
      if (response?.data) {
        const data = response.data;
        if (Array.isArray(data)) return data;
        if (data.$values) return data.$values;
        if (data.data) return data.data;
      }
      
      return [];
    } catch (error) {
      console.warn('Lỗi khi lấy danh sách nhãn hiệu:', error.message);
      throw new Error('Không thể lấy danh sách nhãn hiệu');
    }
  },

  // Tạo nhãn hiệu mới
  create: async (brandData) => {
    try {
      const response = await api.post('/Brand/create-brand', brandData);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi tạo nhãn hiệu:', error.message);
      throw new Error('Không thể tạo nhãn hiệu');
    }
  },

  // Cập nhật nhãn hiệu
  update: async (brandId, brandData) => {
    try {
      const response = await api.put(`/Brand/update-brand/${brandId}`, brandData);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi cập nhật nhãn hiệu:', error.message);
      throw new Error('Không thể cập nhật nhãn hiệu');
    }
  },

  // Xóa nhãn hiệu
  delete: async (brandId) => {
    try {
      const response = await api.delete(`/Brand/delete-brand/${brandId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi xóa nhãn hiệu:', error.message);
      throw new Error('Không thể xóa nhãn hiệu');
    }
  }
};
