import axios from 'axios';

const BASE_URL = 'https://localhost:7130/api'; // Sử dụng URL trực tiếp

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
      console.log('Calling API:', `${BASE_URL}/Product/get_all_product`);
      
      const response = await axios({
        method: 'post',
        url: `${BASE_URL}/Product/get_all_product`,
        data: {
          pageIndex,
          pageSize
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 15000
      });

      console.log('API Response:', response);

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
        if (error.response.status === 405) {
          console.warn('Method not allowed. API requires POST method.');
        }
      } else if (error.request) {
        console.warn('Network Error:', error.request);
      } else {
        console.warn('Error:', error.message);
      }
      return [];
    }
  },

  // Lấy chi tiết sản phẩm
  getDetail: async (productId) => {
    try {
      const response = await api.get(`/Product/get_product_detail/${productId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi lấy chi tiết sản phẩm:', error.message);
      throw new Error('Không thể lấy chi tiết sản phẩm');
    }
  },

  // Tạo sản phẩm mới
  create: async (productData) => {
    try {
      const response = await api.post('/Product/create_product', productData);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi tạo sản phẩm:', error.message);
      throw new Error('Không thể tạo sản phẩm');
    }
  },

  // Cập nhật sản phẩm
  update: async (productId, productData) => {
    try {
      const response = await api.put(`/Product/update_product/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi cập nhật sản phẩm:', error.message);
      throw new Error('Không thể cập nhật sản phẩm');
    }
  },

  // Kích hoạt sản phẩm
  activate: async (productId) => {
    try {
      const response = await api.patch(`/Product/activate_product/${productId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi kích hoạt sản phẩm:', error.message);
      throw new Error('Không thể kích hoạt sản phẩm');
    }
  },

  // Ngừng kích hoạt sản phẩm
  deactivate: async (productId) => {
    try {
      const response = await api.patch(`/Product/deactivate_product/${productId}`);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi ngừng kích hoạt sản phẩm:', error.message);
      throw new Error('Không thể ngừng kích hoạt sản phẩm');
    }
  }
};
