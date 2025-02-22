
import { apiClient, apiEndpoints } from "./utils.api";
import { SkinTest } from "../types/SkinTest";

export const createSkinTest = async (skinTest: SkinTest, token: string): Promise<any> => {
  try {
    const response = await apiClient.post(
      `${apiEndpoints.SkinTest}/create-skin-test`,
      skinTest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating skin test:", error);
    throw error;
  }
};


export const getAllSkinTests = async (): Promise<SkinTest[]> => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.SkinTest}/get-skin-test`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching skin tests:", error);
    throw error;
  }
};
