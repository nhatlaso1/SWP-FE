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

// Hàm gọi API chung, có xử lý lỗi tập trung
export const callApi = async (method, url, data = null, params = {}) => {
  try {
    const response = await api({ method, url, data, params });
    return response.data;
  } catch (error) {
    console.error(`Error calling ${method.toUpperCase()} ${url}:`, error);
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

// Định nghĩa các API cho Product
export const ProductAPI = {
  // Lấy tất cả sản phẩm với phân trang
  getAll: async (pageIndex = 1, pageSize = 10) => {
    try {
      const response = await api.post('/Product/get-all-product', null, {
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
      if (error.response) {
        console.warn('Server Error:', error.response.data);
        if (error.response.status === 404) {
          console.warn('API endpoint not found. Please check if the URL is correct.');
        } else if (error.response.status === 405) {
          console.warn('Method not allowed. API might require a different HTTP method.');
        }
      } else if (error.request) {
        console.warn('Network Error:', error.request);
      } else {
        console.warn('Error:', error.message);
      }
      return [];
    }
  },

  getDetail: async (productId) => {
    try {
      const response = await api.get(`/Product/get-product-detail?productId=${productId}`);
      return response.data;
    } catch (error) {
      console.warn('Error fetching product detail:', error.message);
      throw new Error('Could not fetch product details');
    }
  },

  // Tạo sản phẩm mới
  create: async (productData) => {
    try {
      const response = await api.post('/Product/create-product', productData);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi tạo sản phẩm:', error.message);
      throw new Error('Không thể tạo sản phẩm');
    }
  },

  // Cập nhật sản phẩm
  update: async (productId, productData) => {
    try {
      const response = await api.put(`/Product/update-product/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi cập nhật sản phẩm:', error.message);
      throw new Error('Không thể cập nhật sản phẩm');
    }
  },

  // Kích hoạt sản phẩm
  activate: async (productId) => {
    try {
      const response = await api.patch(`/Product/active-product/${productId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi kích hoạt sản phẩm:', error.message);
      throw new Error('Không thể kích hoạt sản phẩm');
    }
  },

  // Ngừng kích hoạt sản phẩm
  deactivate: async (productId) => {
    try {
      const response = await api.patch(`/Product/inactive-product/${productId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi huỷ kích hoạt sản phẩm:', error.message);
      throw new Error('Không thể huỷ kích hoạt sản phẩm');
    }
  },

  // Lấy số lượng sản phẩm theo danh mục
  getCountByCategory: async (categoryId) => {
    try {
      const response = await api.get(`/Product/count-by-category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi lấy số lượng sản phẩm theo danh mục:', error.message);
      return 0;
    }
  },

  // Lấy số lượng sản phẩm theo nhãn hiệu
  getCountByBrand: async (brandId) => {
    try {
      const response = await api.get(`/Product/count-by-brand/${brandId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi lấy số lượng sản phẩm theo nhãn hiệu:', error.message);
      return 0;
    }
  }
};
