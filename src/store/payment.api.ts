import { apiClient, apiEndpoints } from "./utils.api";


export const createPayment = async (orderId: number, token: string): Promise<string> => {
  try {
    const response = await apiClient.post(
      `${apiEndpoints.Payment}/payment?orderId=${orderId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Trả về link thanh toán từ response
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    
    // Đảm bảo luôn có chuỗi hợp lệ cho JSON.parse
    const cartString = localStorage.getItem('cart') ?? '[]';
    const cart = JSON.parse(cartString);
    
    throw error;
  }
};

