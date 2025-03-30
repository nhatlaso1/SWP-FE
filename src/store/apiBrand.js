import axios from 'axios';

const BASE_URL = '';

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
      const response = await api.get('https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api/Brand/get-brands');
      console.log("lay brand",response);
      if (response?.data) {
        const data = response.data;
        let brands = [];

        if (Array.isArray(data)) brands = data;
        else if (data.$values) brands = data.$values;
        else if (data.data) brands = data.data;

        // Return brands directly without modifying the brandLogo
        return brands;
      }

      return [];
    } catch (error) {
      console.warn('Lỗi khi lấy danh sách nhãn hiệu:', error.message);
      throw new Error('Không thể lấy danh sách nhãn hiệu');
    }
  },

  // Lấy logo của brand
  getBrandLogo: async (brandId) => {
    try {
      const response = await api.get(`/Brand/get-brand-image/${brandId}`, {
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.warn('Lỗi khi lấy logo nhãn hiệu:', error.message);
      return null;
    }
  },

  // Tạo nhãn hiệu mới
  create: async (brandData) => {
    try {
      const formData = new FormData();
      formData.append('brandName', brandData.brandName);
      if (brandData.logo) {
        formData.append('logo', brandData.logo);
      }

      const response = await api.post('/Brand/create-brand', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.warn('Lỗi khi tạo nhãn hiệu:', error.message);
      throw new Error('Không thể tạo nhãn hiệu');
    }
  },

  // Cập nhật nhãn hiệu
  update: async (brandId, brandData) => {
    try {
      const formData = new FormData();
      formData.append('brandName', brandData.brandName);
      if (brandData.logo) {
        formData.append('logo', brandData.logo);
      }

      const response = await api.put(`/Brand/update-brand/${brandId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
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