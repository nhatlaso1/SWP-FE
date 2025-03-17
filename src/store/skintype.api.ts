

import { SkinType } from "../types/skintype";
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
export const getSkinTypeById = async (skinTypeId: number): Promise<SkinType> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinType}/get-skin-type-by-id?skinTypeId=${skinTypeId}`);
    const SkinType: SkinType = {
      skinTypeId: response.data.skinTypeId,
      skinTypeName: response.data.skinTypeName,
      priority: response.data.priority
    };
    return SkinType;
  } catch (error) {
    console.error("Error fetching skin type by id:", error);
    throw error;
  }
};

// Tạo skintype mới
export const createSkinType = async (skintype: SkinType, token: string): Promise<any> => {
  try {
    const response = await apiClient.post(`${apiEndpoints.SkinType}/Create-skin-type`, skintype, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating skintype:", error);
    throw error;
  }
};

export const updateSkinType = async (skintype: SkinType, token: string): Promise<any> => {
  try {
    const response = await apiClient.put(
      `${apiEndpoints.SkinType}/update-skin-type-by-id`,
      skintype,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating skintype:", error);
    throw error;
  }
};
