import { Voucher } from "../types/voucher";
import { apiClient, apiEndpoints } from "./utils.api";

// Lấy tất cả voucher
export const getAllVoucher = async (): Promise<Voucher[]> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.Voucher}/Get-all-voucher`);
    return response.data?.$values || [];
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};

// Lấy voucher theo ID
export const getVoucherById = async (voucherId: number): Promise<Voucher | null> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.Voucher}/Get-voucher-by-voucher-id?voucherId=${voucherId}`);
    return response.data || null;
  } catch (error) {
    console.error("Error fetching voucher:", error);
    throw error;
  }
};

// Lấy tất cả voucher theo customer ID
export const getAllVoucherByCustomerId = async (token: string): Promise<Voucher[]> => {
  if (!token) throw new Error("Token is required"); // Ngăn gọi API khi thiếu token

  try {
    const response = await apiClient.get(`${apiEndpoints.Voucher}/Get-all-voucher-by-customer-id`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.$values || [];
  } catch (error) {
    console.error("Error fetching vouchers:", error);
    throw error;
  }
};

// Tạo voucher mới
export const createVoucher = async (voucher: Voucher, token: string): Promise<any> => {
  try {
    const response = await apiClient.post(`${apiEndpoints.Voucher}/Create-voucher`, voucher, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating voucher:", error);
    throw error;
  }
};
export const updateVoucher = async (voucher: Voucher, token: string): Promise<any> => {
  try {
    const response = await apiClient.put(
      `${apiEndpoints.Voucher}/Update-voucher`,
      voucher,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating voucher:", error.response ? error.response.data : error);
    console.error("Stack trace:", error.stack);
    throw error;
  }
};



