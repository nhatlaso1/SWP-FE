import axios from 'axios';

const BASE_URL = 'https://localhost:7130/api';

export const SkinTypeAPI = {
  getAll: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/SkinType/get-all-skin-type`);
      return response.data;
    } catch (error) {
      console.error('Error fetching skin types:', error);
      throw error;
    }
  }
}; 