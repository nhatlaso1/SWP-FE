import axios from 'axios';

const BASE_URL = 'https://localhost:7130/api';

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