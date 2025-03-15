import axios from 'axios';

const BASE_URL = 'https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api';

export const IngredientAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Ingredient/get-ingredients`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ingredients:', error);
      throw error;
    }
  }
}; 