
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
  