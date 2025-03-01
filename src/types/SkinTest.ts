
export interface ListSkinTest {
  id?: number;
  skinTestName: string;
  status: boolean;
}
export interface SkinTest {
    id?: number;
    skinTestName: string;
    status: boolean;
    skinTypeQuestions: SkinTypeQuestion[];
  }
  
  export interface SkinTypeQuestion {
    description: string;
    status: boolean;
    skinTypeAnswers: SkinTypeAnswer[];
  }
  
  export interface SkinTypeAnswer {
    description: string;
    skinTypeId: number;
  }
  
// Dữ liệu trả về từ API
// Kiểu dữ liệu nhận từ API
export interface ApiSkinTest {
  skinTestId: number;
  skinTestName: string;
  status: string;
  skinTypeQuestions: ApiSkinTypeQuestion[];
}

export interface ApiSkinTypeQuestion {
  skinTypeQuestionId: number;
  description: string;
  status: boolean;
  skinTypeAnswers: ApiSkinTypeAnswer[];
}

export type ApiSkinTypeAnswer = {
  skinTypeAnswerId?: number;
  description: string;
  skinTypeId: number;
};

export interface UpdateSkinTest {
  skinTestId: number;
  skinTestName: string;
  status: boolean;
  skinTypeQuestions: {
    skinTypeQuestionId?: number; // Optional nếu cho phép thêm câu hỏi mới
    description: string;
    skinTypeAnswers: {
      skinTypeAnswerId?: number; // Optional nếu cho phép thêm đáp án mới
      description: string;
      skinTypeId: number;
    }[];
  }[];
}

export interface UpdateSkinTypeQuestion {
  description: string;
  skinTypeAnswers: UpdateSkinTypeAnswer[];
}

export interface UpdateSkinTypeAnswer {
  description: string;
  skinTypeId: number;
}
