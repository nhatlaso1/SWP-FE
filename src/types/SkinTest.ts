// Dành cho giao diện hiển thị (nội bộ ứng dụng)
export interface ListSkinTest {
  skinTestId?: number;
  skinTestName: string;
  status: boolean; // true: Active (Single Choice), false: Inactive (Multiple Choice)
}

export interface SkinTest {
  skinTestId?: number;
  skinTestName: string;
  status: boolean;
  skinTypeQuestions: SkinTypeQuestion[];
}

export interface SkinTypeQuestion {
  skinTypeQuestionId?: number; // Optional nếu thêm câu hỏi mới
  description: string;
  status: boolean; // Dùng để lưu trạng thái của câu hỏi (Single Choice nếu true, Multiple Choice nếu false)
  skinTypeAnswers: SkinTypeAnswer[];
}

export interface SkinTypeAnswer {
  skinTypeAnswerId?: number; // Optional nếu thêm đáp án mới
  description: string;
  skinTypeId: number;
}

// Dữ liệu trả về từ API
export interface ApiSkinTest {
  skinTestId: number;
  skinTestName: string;
  status: string; // Thông thường API trả về "0"/"1" hoặc "false"/"true" dưới dạng chuỗi
  skinTypeQuestions: ApiSkinTypeQuestion[];
}

export interface ApiSkinTypeQuestion {
  skinTypeQuestionId: number;
  description: string;
  // API trả về trường "type" thay vì "status"
  type: boolean;
  skinTypeAnswers: ApiSkinTypeAnswer[];
}

export interface ApiSkinTypeAnswer {
  skinTypeAnswerId?: number;
  description: string;
  skinTypeId: number;
}

// Dữ liệu dùng cho Update
export interface UpdateSkinTest {
  skinTestId: number;
  skinTestName: string;
  status: boolean;
  skinTypeQuestions: {
    skinTypeQuestionId?: number;
    description: string;
    status: boolean; // Dùng để lưu trạng thái của câu hỏi (sẽ được chuyển thành "type" khi gửi payload)
    skinTypeAnswers: {
      skinTypeAnswerId?: number;
      description: string;
      skinTypeId: number;
    }[];
  }[];
}

export interface UpdateSkinTypeQuestion {
  description: string;
  status: boolean;
  skinTypeAnswers: UpdateSkinTypeAnswer[];
}

export interface UpdateSkinTypeAnswer {
  description: string;
  skinTypeId: number;
}
