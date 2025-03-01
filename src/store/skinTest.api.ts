import { apiClient, apiEndpoints } from "./utils.api"; // Import axios instance và apiEndpoints
import { SkinTest, SkinTypeQuestion, SkinTypeAnswer, ApiSkinTest, ApiSkinTypeQuestion, ApiSkinTypeAnswer } from "../types/SkinTest";

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

interface ApiResponse {
  $id: string;
  $values: SkinTest[];
}

export const getAllSkinTests = async (token: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinTest}/get-all-skin-test`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching all skin tests:", error);
    throw error;
  }
};

export const getSkinTestById = async (id: number, token: string): Promise<ApiSkinTest | null> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinTest}/get-skin-test?skinTestId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiData: ApiSkinTest = response.data;
    return mapApiToSkinTest(apiData);
  } catch (error) {
    console.error("Error fetching skin test by id:", error);
    throw error;
  }
};
interface UpdateSkinTest {
  skinTestId: number;
  skinTestName: string;
  status: boolean;
  skinTypeQuestions: {
    skinTypeQuestionId: number;
    description: string;
    skinTypeAnswers: {
      skinTypeAnswerId: number;
      description: string;
      skinTypeId: number;
    }[];
  }[];
}

export const updateSkinTest = async (skinTest: UpdateSkinTest, token: string): Promise<any> => {
  try {
    const payload = {
      skinTestId: skinTest.skinTestId,
      skinTestName: skinTest.skinTestName,
      status: skinTest.status,
      skinTypeQuestions: skinTest.skinTypeQuestions.map((question) => ({
        skinTypeQuestionId: question.skinTypeQuestionId,
        description: question.description,
        skinTypeAnswers: question.skinTypeAnswers.map((answer) => ({
          skinTypeAnswerId: answer.skinTypeAnswerId,
          description: answer.description,
          skinTypeId: answer.skinTypeId,
        })),
      })),
    };

    const response = await apiClient.put(
      `${apiEndpoints.SkinTest}/update-skin-test`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error updating skin test:", error);
    throw error;
  }
};





export const mapApiToSkinTest = (apiData: any): ApiSkinTest => {
  return {
      skinTestId: apiData.skinTestId,
      skinTestName: apiData.skinTestName,
      status: apiData.status,
      skinTypeQuestions: apiData.skinTypeQuestions?.$values?.map((question: any) => ({
          skinTypeQuestionId: question.skinTypeQuestionId,
          description: question.description,
          skinTypeAnswers: question.skinTypeAnswers?.$values?.map((answer: any) => ({
              skinTypeAnswerId: answer.skinTypeAnswerId,
              description: answer.description,
              skinTypeId: answer.skinTypeId,
          })) || [],
      })) || [],
  };
};
export const getAllSkinTypes = async (token: string): Promise<any> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinType}/get-all-skin-type`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all skin types:", error);
    throw error;
  }
};

export const getSkinTypeById = async (id: number, token: string): Promise<any> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinType}/get-skin-type-by-id?skinTypeId=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching skin type by id:", error);
    throw error;
  }
};