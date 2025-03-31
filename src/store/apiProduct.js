import axios from 'axios';



const BASE_URL = 'https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api';



const api = axios.create({

  baseURL: BASE_URL,

  timeout: 15000,

  headers: {

    'Content-Type': 'application/json',

    'Accept': 'application/json'

  },

  withCredentials: false // Thêm option này để tránh vấn đề CORS

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

  (error) => {

    return Promise.reject(error);

  }

);



// Add response interceptor for error handling

api.interceptors.response.use(

  response => response,

  error => {

    if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {

      console.warn('Không thể kết nối đến server');

      return Promise.resolve({ data: { $values: [] } });

    }

    return Promise.reject(error);

  }

);



// Hàm gọi API chung, có xử lý lỗi tập trung

const callApi = async (method, url, data = null, params = {}) => {

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



// Định nghĩa các API cho Product

export const ProductAPI = {

  getAll: async (payload = {}) => {
    console.log('getAll payload:', payload);
    try {



      // Gọi API với POST method và parameters để lấy tất cả sản phẩm

      const response = await api.post('/Product/get-all-product', null, {
        params: {
          pageIndex: 1,
          pageSize: 999,
          sortColumn: 'productId',
          sortOrder: 'asc'
        }
      });



      console.log('Raw API Response:', response);
      console.log('Response data:', response.data);

      // Kiểm tra và xử lý dữ liệu
      let products = [];

      if (response?.data) {
        // Xử lý dữ liệu sản phẩm
        if (response.data.$values) {
          products = response.data.$values;
        } else if (Array.isArray(response.data)) {
          products = response.data;
        } else if (response.data.data?.$values) {
          products = response.data.data.$values;
        }
      }

      // Đảm bảo products luôn là một mảng
      if (!Array.isArray(products)) {
        products = [];
      }

      // Sắp xếp sản phẩm theo productId
      products.sort((a, b) => a.productId - b.productId);

      // Tính toán phân trang
      const totalItems = products.length;
      const pageSize = 10; // Số sản phẩm trên mỗi trang
      const totalPages = Math.ceil(totalItems / pageSize);
      const currentPage = payload.pageIndex || 1;

      // Lấy sản phẩm cho trang hiện tại
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedProducts = products.slice(startIndex, endIndex);

      return {
        products: paginatedProducts,
        pagination: {
          totalItems: totalItems,
          currentPage: currentPage,
          pageSize: pageSize,
          totalPages: totalPages
        }
      };

    } catch (error) {

      console.error('Error in getAll:', error);

      return {

        products: [],

        pagination: {

          totalItems: 0,

          currentPage: 1,

          pageSize: 10,

          totalPages: 0

        }

      };

    }

  },



  // Lấy chi tiết sản phẩm

  getDetail: async (productId) => {

    try {

      console.log('Calling get product detail with ID:', productId);

      const response = await api.get(`/Product/get-product-detail`, {

        params: { productId }

      });

      console.log('Product detail response:', response.data);

      return response.data;

    } catch (error) {

      console.warn('Lỗi khi lấy chi tiết sản phẩm:', error.message);

      if (error.response?.status === 404) {

        console.warn('Không tìm thấy sản phẩm với ID:', productId);

      }

      throw new Error('Không thể lấy chi tiết sản phẩm');

    }

  },



  // Tạo sản phẩm mới

  create: async (productData) => {

    try {

      console.log('Creating new product with data:', productData);


      const requestBody = {

        productName: productData.productName?.trim() || '',

        summary: productData.summary?.trim() || '',

        size: productData.size?.trim() || '',

        price: parseFloat(productData.price) || 0,

        quantity: parseInt(productData.quantity) || 0,

        discount: parseFloat(productData.discount) || 0,

        isRecommended: Boolean(productData.isRecommended),

        brandId: parseInt(productData.brandId) || 0,

        categoryId: parseInt(productData.categoryId) || 0,

        skinTypes: productData.skinTypes || [],

        ingredients: productData.ingredients || [],

        functions: productData.functions || [],

        images: productData.images || []

      };



      console.log('Sending create request to:', `${BASE_URL}/Product/create-product`);

      console.log('Request body:', JSON.stringify(requestBody, null, 2));



      const response = await api.post('/Product/create-product', requestBody);


      if (!response.data) {

        throw new Error('Không nhận được phản hồi từ server');

      }



      console.log('Create product response:', response);

      console.log('Response status:', response.status);

      console.log('Response data:', response.data);


      return response.data;

    } catch (error) {

      console.error('Error creating product. Full error:', error);


      if (error.response) {

        // Server trả về lỗi với status code

        console.error('Server error details:', {

          status: error.response.status,

          statusText: error.response.statusText,

          data: error.response.data,

          headers: error.response.headers

        });


        const errorMessage = error.response.data?.detail

          || error.response.data?.message

          || error.response.data?.title

          || 'Lỗi từ server khi tạo sản phẩm';


        throw new Error(errorMessage);

      } else if (error.request) {

        // Request được gửi nhưng không nhận được response

        console.error('Network error - no response received:', error.request);

        throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');

      } else {

        // Lỗi khi thiết lập request

        console.error('Request setup error:', error.message);

        throw new Error('Lỗi khi gửi yêu cầu: ' + error.message);

      }

    }

  },



  // Cập nhật sản phẩm

  update: async (productId, productData) => {

    try {

      console.log('Updating product with ID:', productId);
      console.log('Update data:', productData);

      // Đảm bảo productId là số nguyên
      const numericProductId = parseInt(productId);
      if (isNaN(numericProductId)) {
        throw new Error('ID sản phẩm không hợp lệ');
      }

      // Xử lý dữ liệu hình ảnh
      const images = productData.images?.map(img => {
        if (typeof img === 'string') return img;
        return img.url || img.productImage || '';
      }).filter(url => url !== '');

      const response = await api.put(`/Product/update-product`, {
        productName: productData.productName,
        size: productData.size,
        price: productData.price,
        quantity: productData.quantity,
        discount: productData.discount,
        summary: productData.summary,
        isRecommended: productData.isRecommended,
        brandId: productData.brandId,
        categoryId: productData.categoryId,
        skinTypes: productData.skinTypes || [],
        ingredients: productData.ingredients || [],
        functions: productData.functions || [],
        images: images
      }, {
        params: { productId: numericProductId }
      });

      console.log('Update response:', response.data);
      return response.data;

    } catch (error) {

      console.error('Error updating product:', error.response || error);
      if (error.response?.status === 404) {
        throw new Error('Không tìm thấy sản phẩm để cập nhật');
      } else if (error.response?.status === 400) {
        const errorDetail = error.response?.data?.detail || error.response?.data?.message;
        throw new Error(errorDetail || 'Dữ liệu cập nhật không hợp lệ');
      }
      throw new Error('Không thể cập nhật sản phẩm');
    }

  },



  // Kích hoạt sản phẩm

  activate: async (productId) => {

    try {

      const response = await api.patch(`/Product/active-product`, null, {

        params: { productId }

      });


      return response.data;

    } catch (error) {

      console.warn('Lỗi khi kích hoạt sản phẩm:', error.message);

      throw new Error('Không thể kích hoạt sản phẩm');

    }

  },



  // Ngừng kích hoạt sản phẩm

  deactivate: async (productId) => {

    try {

      const response = await api.patch(`/Product/inactive-product`, null, {

        params: { productId }

      });


      return response.data;

    } catch (error) {

      console.warn('Lỗi khi ngừng kích hoạt sản phẩm:', error.message);

      throw new Error('Không thể ngừng kích hoạt sản phẩm');

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

  },



  // Lấy tất cả sản phẩm theo brand ID

  getProductsByBrand: async (brandId) => {

    try {

      console.log('Calling getProductsByBrand with brandId:', brandId);

      const response = await api.get(`/Product/get-products-by-brand`, {

        params: { brandId }

      });

      console.log('Products by brand response:', response.data);

      return response.data;

    } catch (error) {

      console.error('Error fetching products by brand:', error);

      throw new Error('Failed to load products for the selected brand.');

    }

  },



  // Lấy tất cả sản phẩm bán chạy

  getBestSellerProducts: async () => {

    try {

      console.log('Calling getBestSellerProducts API');

      const response = await api.get('/Product/get-best-seller-product');

      console.log('Best seller products response:', response.data);

      return response.data.$values || [];

    } catch (error) {

      console.error('Error fetching best seller products:', error);

      throw new Error('Failed to load best seller products.');

    }

  }

};



