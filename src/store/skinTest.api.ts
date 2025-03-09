import { apiClient, apiEndpoints } from "./utils.api"; // Import axios instance và apiEndpoints
import { 
  SkinTest, 
  ApiSkinTest,
} from "../types/SkinTest";

// Tạo mới SkinTest
export const createSkinTest = async (skinTest: SkinTest, token: string): Promise<any> => {
  try {
    // Map các câu hỏi: chuyển "status" thành "type"
    const payload = {
      skinTestId: skinTest.skinTestId,
      skinTestName: skinTest.skinTestName,
      status: skinTest.status,
      skinTypeQuestions: skinTest.skinTypeQuestions.map((question) => ({
        skinTypeQuestionId: question.skinTypeQuestionId,
        description: question.description,
        type: question.status, // chuyển status (một boolean) thành type cho API
        skinTypeAnswers: question.skinTypeAnswers.map((answer) => ({
          skinTypeAnswerId: answer.skinTypeAnswerId,
          description: answer.description,
          skinTypeId: answer.skinTypeId,
        })),
      })),
    };

    const response = await apiClient.post(
      `${apiEndpoints.SkinTest}/create-skin-test`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating skin test:", error);
    throw error;
  }
};


interface ApiResponse {
  $id: string;
  $values: SkinTest[];
}

// Lấy danh sách SkinTest
export const getAllSkinTests = async (token: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinTest}/get-all-skin-test`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching all skin tests:", error);
    throw error;
  }
};

// Hàm map response của API thành object theo định dạng của ứng dụng
// Lưu ý: API của bạn trả về cho câu hỏi trường "type", nên ta map thành thuộc tính nội bộ "status"
export const mapApiToSkinTest = (apiData: any): ApiSkinTest => {
  return {
    skinTestId: apiData.skinTestId,
    skinTestName: apiData.skinTestName,
    status: apiData.status, // Status của SkinTest chính
    skinTypeQuestions: apiData.skinTypeQuestions?.$values?.map((question: any) => ({
      skinTypeQuestionId: question.skinTypeQuestionId,
      description: question.description,
      // Nếu trường type có tồn tại, dùng nó làm giá trị cho status; nếu không, mặc định false
      status: question.type !== undefined ? question.type : false,
      skinTypeAnswers: question.skinTypeAnswers?.$values?.map((answer: any) => ({
        skinTypeAnswerId: answer.skinTypeAnswerId,
        description: answer.description,
        skinTypeId: answer.skinTypeId,
      })) || [],
    })) || [],
  };
};

// Lấy SkinTest theo id
export const getSkinTestById = async (id: number, token: string): Promise<ApiSkinTest | null> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinTest}/get-skin-test?skinTestId=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
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
    status: boolean; // Thêm thuộc tính này để lưu trạng thái của câu hỏi (Single/Multiple Choice)
    skinTypeAnswers: {
      skinTypeAnswerId: number;
      description: string;
      skinTypeId: number;
    }[];
  }[];
}

// Update SkinTest
export const updateSkinTest = async (skinTest: UpdateSkinTest, token: string): Promise<any> => {
  try {
    const payload = {
      skinTestId: skinTest.skinTestId,
      skinTestName: skinTest.skinTestName,
      status: skinTest.status,
      skinTypeQuestions: skinTest.skinTypeQuestions.map((question) => ({
        skinTypeQuestionId: question.skinTypeQuestionId,
        description: question.description,
        // Gửi trường "type" với giá trị từ status nội bộ
        type: question.status,
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
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating skin test:", error);
    throw error;
  }
};

// Lấy tất cả các SkinType
export const getAllSkinTypes = async (token: string): Promise<any> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinType}/get-all-skin-type`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching all skin types:", error);
    throw error;
  }
};

// Lấy SkinType theo id
export const getSkinTypeById = async (id: number, token: string): Promise<any> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.SkinType}/get-skin-type-by-id?skinTypeId=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching skin type by id:", error);
    throw error;
  }
};
