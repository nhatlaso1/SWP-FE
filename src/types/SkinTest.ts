
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
  skinTypeAnswers: ApiSkinTypeAnswer[];
}

export type ApiSkinTypeAnswer = {
  skinTypeAnswerId?: number;
  description: string;
  skinTypeId: number;
};
