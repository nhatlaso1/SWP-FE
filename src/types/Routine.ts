// Interface cho bước trong routine (Routine Step)
export interface RoutineStep {
  routineStepId?: number; // Optional: có mặt khi cập nhật, không cần khi tạo mới
  step: number;
  instruction: string;
  categoryId: number;
}

// Interface cho chi tiết routine (Routine Detail)
export interface RoutineDetail {
  routineDetailId?: number; // Optional: có mặt khi cập nhật, không cần khi tạo mới
  routineDetailName: string;
  routineSteps: RoutineStep[];
}

// Interface cho Routine (dùng cho create, update, view)
export interface Routine {
  routineId?: number; // Optional khi tạo mới, bắt buộc khi cập nhật
  routineName: string;
  status?: boolean;   // Thêm status nếu cần thiết
  skinTypeId: number;
  skinTypeName?: string; // API trả về skinTypeName
  routineDetails: RoutineDetail[];
}


// Interface cho dữ liệu Routine lấy về
export interface AllRoutine {
  routineId: number;
  routineName: string;
  status: boolean;
  skinTypeId: number;
  skinTypeName: string;
}

