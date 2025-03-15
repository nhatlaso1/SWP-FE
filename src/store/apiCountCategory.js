import axios from 'axios';

const BASE_URL = 'https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api';

export const CategoryCountAPI = {
  getCategoriesWithCount: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Category/get-number-product-by-category-id`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCategoryWithCount: async (categoryId) => {
    try {
      const response = await axios.get(`${BASE_URL}/Category/get-number-product-by-category-id`, {
        params: { categoryId }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
