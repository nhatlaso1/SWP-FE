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

// Thêm interceptor để xử lý lỗi network
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

export const CategoryAPI = {
  // Lấy tất cả danh mục
  getAll: async () => {
    try {
      console.log('Calling Category API:', `${BASE_URL}/Category/get-categories`);
      const response = await api.get('/Category/get-categories');
      console.log('Category API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Không thể lấy danh sách danh mục');
    }
  },

  // Tạo danh mục mới
  create: async (categoryData) => {
    try {
      console.log('Creating category:', categoryData);
      const response = await api.post('/Category/create-category', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw new Error('Không thể tạo danh mục mới');
    }
  }
};
