// Interface cho bước trong routine (Routine Step)
export interface RoutineStep {
    step: number;
    instruction: string;
    categoryId: number;
  }
  
  // Interface cho chi tiết routine (Routine Detail)
  export interface RoutineDetail {
    routineDetailName: string;
    routineSteps: RoutineStep[];
  }
  
  // Interface cho Routine (dùng cho create, update, view)
  export interface Routine {
    routineId?: number; // Optional khi tạo mới
    routineName: string;
    // Vì API trả về skinTypeName thay vì skinTypeId,
    // ta thêm cả skinTypeName (và giữ skinTypeId mặc định là 0)
    skinTypeId: number;
    skinTypeName?: string;
    routineDetails: RoutineDetail[];
  }
  