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

// API lấy danh mục
export const CategoryAPI = {
  getAll: async () => {
    try {
      console.log('Calling Category API:', `${BASE_URL}/Category/get-categories`);
      const response = await api.get('/Category/get-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw new Error('Không thể lấy danh sách danh mục');
    }
  }
};

// API lấy số lượng sản phẩm theo danh mục
export const CategoryCountAPI = {
  getCategoriesWithCount: async () => {
    try {
      const categoryResponse = await CategoryAPI.getAll();
      console.log('Dữ liệu trả về từ CategoryAPI.getAll():', categoryResponse);

      // Kiểm tra dữ liệu có phải là mảng không
      let categories = categoryResponse?.$values || categoryResponse || [];
      
      if (!Array.isArray(categories)) {
        console.error('Lỗi: Dữ liệu danh mục không phải là mảng!', categories);
        categories = []; // Đảm bảo categories luôn là mảng
      }

      const productResponse = await api.post('/Product/get-all-product', {
        pageIndex: 1,
        pageSize: 999
      });

      console.log('Dữ liệu sản phẩm:', productResponse.data);
      
      const products = productResponse.data?.$values || productResponse.data?.data?.$values || productResponse.data || [];
      
      const productCounts = {};
      products.forEach(product => {
        if (product?.categoryId) {
          productCounts[product.categoryId] = (productCounts[product.categoryId] || 0) + 1;
        }
      });

      console.log('Số lượng sản phẩm theo danh mục:', productCounts);

      return categories.map(category => ({
        ...category,
        productCount: productCounts[category.categoryId] || 0
      }));
    } catch (error) {
      console.error('Lỗi khi lấy danh mục kèm số lượng sản phẩm:', error);
      throw error;
    }
  }
};
