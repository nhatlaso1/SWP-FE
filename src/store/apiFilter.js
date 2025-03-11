import axios from 'axios';

const BASE_URL = 'https://localhost:7130/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, // Nếu cần tránh CORS
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      console.warn('Không thể kết nối đến server');
      // Trả về data rỗng để tránh phá vỡ chuỗi xử lý
      return Promise.resolve({ data: { $values: [] } });
    }
    return Promise.reject(error);
  }
);

/**
 * Gọi API chung.
 * @param {'get'|'post'|'put'|'patch'|'delete'} method - Phương thức HTTP.
 * @param {string} url - Đường dẫn API.
 * @param {any} [data] - Body của request (nếu có).
 * @param {any} [params] - Query string (nếu có).
 * @returns {Promise<any>}
 */
export const callApi = async (method, url, data = null, params = {}) => {
  try {
    console.log(`Calling API ${method.toUpperCase()}: ${url}`, { data, params });
    const response = await api({ method, url, data, params });
    console.log('API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error calling ${method.toUpperCase()} ${url}:`, error);
    throw new Error(error.response?.data?.message || 'Có lỗi xảy ra!');
  }
};

// ------------------- PRODUCT API -------------------
export const ProductAPI = {
  // Lấy tất cả sản phẩm (sử dụng callApi với payload ở body)
  getAll: async (payload = {}) => {
    try {
      console.log('Calling getAll products with params:', payload);
      // Gọi API với POST, truyền payload vào body
      const response = await callApi('post', '/Product/get-all-product', payload);
      console.log('Raw API Response:', response);

      let products = [];
      let pagination = null;

      if (response && response.products) {
        products = response.products;
        pagination = response.pagination;
      } else if (response && response.$values) {
        products = response.$values;
      } else if (Array.isArray(response)) {
        products = response;
      } else if (response.data?.$values) {
        products = response.data.$values;
        pagination = response.data.pagination;
      }

      return {
        products,
        pagination,
      };
    } catch (error) {
      console.error('Error in getAll:', error);
      return {
        products: [],
        pagination: null,
      };
    }
  },

  // Lấy chi tiết sản phẩm
  getDetail: async (productId) => {
    try {
      console.log('Calling get product detail with ID:', productId);
      const response = await api.get('/Product/get-product-detail', {
        params: { productId },
      });
      console.log('Product detail response:', response.data);
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi lấy chi tiết sản phẩm:', error.message);
      throw new Error('Không thể lấy chi tiết sản phẩm');
    }
  },

  // Tạo sản phẩm mới
  create: async (productData) => {
    try {
      console.log('Creating new product with data:', productData);
      const response = await callApi('post', '/Product/create-product', productData);
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Cập nhật sản phẩm
  update: async (productId, productData) => {
    try {
      console.log('Updating product with ID:', productId);
      const response = await callApi('put', '/Product/update-product', productData, { productId });
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Kích hoạt sản phẩm
  activate: async (productId) => {
    try {
      const response = await callApi('patch', `/Product/activate-product/${productId}`);
      return response;
    } catch (error) {
      console.warn('Lỗi khi kích hoạt sản phẩm:', error.message);
      throw new Error('Không thể kích hoạt sản phẩm');
    }
  },

  // Ngừng kích hoạt sản phẩm
  deactivate: async (productId) => {
    try {
      const response = await callApi('patch', `/Product/deactivate-product/${productId}`);
      return response;
    } catch (error) {
      console.warn('Lỗi khi ngừng kích hoạt sản phẩm:', error.message);
      throw new Error('Không thể ngừng kích hoạt sản phẩm');
    }
  },

  // Lấy số lượng sản phẩm theo danh mục
  getCountByCategory: async (categoryId) => {
    try {
      const response = await callApi('get', `/Product/count-by-category/${categoryId}`);
      return response;
    } catch (error) {
      console.warn('Lỗi khi lấy số lượng sản phẩm theo danh mục:', error.message);
      return 0;
    }
  },

  // Lấy số lượng sản phẩm theo nhãn hiệu
  getCountByBrand: async (brandId) => {
    try {
      const response = await callApi('get', `/Product/count-by-brand/${brandId}`);
      return response;
    } catch (error) {
      console.warn('Lỗi khi lấy số lượng sản phẩm theo nhãn hiệu:', error.message);
      return 0;
    }
  },

  // Lấy tất cả sản phẩm theo brand ID
  getProductsByBrand: async (brandId) => {
    try {
      console.log('Calling getProductsByBrand with brandId:', brandId);
      const response = await callApi('get', '/Product/get-products-by-brand', null, { brandId });
      return response;
    } catch (error) {
      console.error('Error fetching products by brand:', error);
      throw new Error('Failed to load products for the selected brand.');
    }
  },

  // Lấy tất cả sản phẩm bán chạy
  getBestSellerProducts: async () => {
    try {
      console.log('Calling getBestSellerProducts API');
      const response = await callApi('get', '/Product/get-best-seller-product');
      if (response && response.$values) {
        return response.$values;
      }
      return [];
    } catch (error) {
      console.error('Error fetching best seller products:', error);
      throw new Error('Failed to load best seller products.');
    }
  },
};

// Hàm kích hoạt sản phẩm
export const activateProduct = async (productId) => {
  try {
    const response = await callApi('patch', '/Product/active-product', null, { productId });
    return response;
  } catch (error) {
    console.error('Error activating product:', error);
    throw new Error('Không thể kích hoạt sản phẩm');
  }
};

// Hàm ngừng kích hoạt sản phẩm
export const deactivateProduct = async (productId) => {
  try {
    const response = await callApi('patch', '/Product/inactive-product', null, { productId });
    return response;
  } catch (error) {
    console.error('Error deactivating product:', error);
    throw new Error('Không thể ngừng kích hoạt sản phẩm');
  }
};

// ------------------- FILTER API -------------------
function parseData(response) {
  if (!response || !response.data) return [];
  if (response.data.$values) {
    return response.data.$values;
  }
  if (Array.isArray(response.data)) {
    return response.data;
  }
  if (response.data.data?.$values) {
    return response.data.data.$values;
  }
  return [];
}

const FilterAPI = {
  getBrands: async () => {
    try {
      const response = await callApi('get', '/Brand/get-brands');
      return parseData({ data: response });
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  },
  getCategories: async () => {
    try {
      const response = await callApi('get', '/Category/get-categories');
      return parseData({ data: response });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
  getFunctions: async () => {
    try {
      const response = await callApi('get', '/Function/get-functions');
      return parseData({ data: response });
    } catch (error) {
      console.error('Error fetching functions:', error);
      return [];
    }
  },
  getIngredients: async () => {
    try {
      const response = await callApi('get', '/Ingredient/get-ingredients');
      return parseData({ data: response });
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      return [];
    }
  },
  getSkinTypes: async () => {
    try {
      const response = await callApi('get', '/SkinType/get-all-skin-type');
      return parseData({ data: response });
    } catch (error) {
      console.error('Error fetching skin types:', error);
      return [];
    }
  },

  // Lấy đồng thời 5 loại filter
  getAllFilters: async () => {
    try {
      const [brands, categories, functions, ingredients, skinTypes] = await Promise.all([
        FilterAPI.getBrands(),
        FilterAPI.getCategories(),
        FilterAPI.getFunctions(),
        FilterAPI.getIngredients(),
        FilterAPI.getSkinTypes(),
      ]);
      return { brands, categories, functions, ingredients, skinTypes };
    } catch (error) {
      console.error('Error fetching all filters:', error);
      throw new Error('Failed to fetch filters.');
    }
  },
};

export { FilterAPI };
