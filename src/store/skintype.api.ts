import { apiClient, apiEndpoints } from "./utils.api";

// Lấy tất cả SkinType
export const getAllSkinType = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinType}/get-all-skin-type`);
    // Giả sử API trả về dữ liệu có cấu trúc { "$id": "...", "$values": [ ... ] }
    const data = response.data;
    return data?.$values || [];
  } catch (error) {
    console.error("Error fetching skin types:", error);
    throw error;
  }
};

// Lấy SkinType theo skinTypeId
export const getSkinTypeById = async (skinTypeId: number): Promise<any> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinType}/get-skin-type-by-id?skinTypeId=${skinTypeId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching skin type by id:", error);
    throw error;
  }
};
