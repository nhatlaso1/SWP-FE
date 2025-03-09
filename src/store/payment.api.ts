import { apiClient, apiEndpoints } from "./utils.api";


export const createPayment = async (orderId: number, token: string): Promise<string> => {
  try {
    
      const response = await apiClient.post(
        `${apiEndpoints.Payment}/payment?orderId=${orderId}`, // orderId trong query string
        {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Xác thực người dùng bằng token
        },
      }
    );

    // Trả về link thanh toán từ response
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
};
