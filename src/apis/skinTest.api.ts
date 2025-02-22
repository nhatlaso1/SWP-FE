import { apiClient, apiEndpoints } from "./utils.api"; // Import axios instance và apiEndpoints
import { SkinTest } from "../types/SkinTest"; // Import interface SkinTest

// Hàm tạo Skin Test mới
export const createSkinTest = async (skinTest: SkinTest, token: string): Promise<any> => {
  try {
    const response = await apiClient.post(
      `${apiEndpoints.SkinTest}/create-skin-test`, // Đường dẫn API tạo Skin Test mới
      skinTest, // Dữ liệu Skin Test sẽ được gửi lên
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header để xác thực người dùng
        },
      }
    );
    return response.data; // Trả về dữ liệu từ server
  } catch (error) {
    console.error("Error creating skin test:", error); // Xử lý lỗi nếu có
    throw error;
  }
};

export const getSkinTestById = async (id: number, token: string): Promise<SkinTest | null> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinTest}/get-skin-test?skinTestId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      }
    });
    return response.data || null;
  } catch (error) {
    console.error("Error fetching skin test by id:", error);
    throw error;
  }
};
// Hàm cập nhật Skin Test
export const updateSkinTest = async (skinTest: SkinTest, token: string): Promise<any> => {
  try {
    const response = await apiClient.put(
      `${apiEndpoints.SkinTest}/update-skin-test`, // Đường dẫn API cập nhật Skin Test
      skinTest, // Dữ liệu Skin Test sẽ được gửi lên
      {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header để xác thực người dùng
        },
      }
    );
    return response.data; // Trả về dữ liệu từ server
  } catch (error) {
    console.error("Error updating skin test:", error); // Xử lý lỗi nếu có
    throw error;
  }
};
