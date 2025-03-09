import axios from 'axios';

const BASE_URL = 'https://localhost:7130/api/Order';

export const orderApi = {
  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await axios.post(`${BASE_URL}/create_order`, orderData);
      return response.data;
    } catch (error) {
      throw new Error('Không thể tạo đơn hàng: ' + error.message);
    }
  },

  // Hoàn thành đơn hàng
  completeOrder: async (orderId) => {
    try {
      const response = await axios.patch(`${BASE_URL}/complete_order`, { orderId });
      return response.data;
    } catch (error) {
      throw new Error('Không thể hoàn thành đơn hàng: ' + error.message);
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      const response = await axios.patch(`${BASE_URL}/cancel_order`, { orderId });
      return response.data;
    } catch (error) {
      throw new Error('Không thể hủy đơn hàng: ' + error.message);
    }
  },

  // Lấy đơn hàng của người dùng
  getUserOrders: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/get_user_order`, {
        params: { userId }
      });
      return response.data;
    } catch (error) {
      throw new Error('Không thể lấy đơn hàng của người dùng: ' + error.message);
    }
  },

  // Lấy tất cả đơn hàng
  getAllOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get_all_order`);
      return response.data;
    } catch (error) {
      throw new Error('Không thể lấy danh sách đơn hàng: ' + error.message);
    }
  }
}; 