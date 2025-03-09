import { apiClient, apiEndpoints } from "./utils.api";

// Lấy tất cả Voucher
export const getAllVoucher = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.Voucher}/Get-all-voucher`);
    // Giả sử API trả về dữ liệu có cấu trúc { "$id": "...", "$values": [ ... ] }
    const data = response.data;
    return data?.$values || [];
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};
