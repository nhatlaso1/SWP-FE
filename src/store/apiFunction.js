import axios from 'axios';

const BASE_URL = 'https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api';

export const FunctionAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Function/get-functions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching functions:', error);
      throw error;
    }
  }
}; 