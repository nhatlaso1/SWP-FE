import { Routine } from "./Routine";

// Hàm ánh xạ từ API sang Routine nội bộ, gán giá trị mặc định nếu trường bị thiếu
export const mapApiToRoutine = (apiData: any): Routine => {
  return {
    routineId: apiData.routineId !== undefined ? apiData.routineId : 0,
    routineName: apiData.routineName || "",
    status: apiData.status || false,
    // Nếu API trả về đối tượng skinType thì lấy từ đó
    skinTypeId: apiData.skinType?.skinTypeId || 0,
    skinTypeName: apiData.skinType?.skinTypeName || "",
    routineDetails: Array.isArray(apiData.routineDetails?.$values)
      ? apiData.routineDetails.$values.map((detail: any) => ({
          routineDetailId: detail.routineDetailId !== undefined ? detail.routineDetailId : 0,
          routineDetailName: detail.routineDetailName || "",
          routineSteps: Array.isArray(detail.routineSteps?.$values)
            ? detail.routineSteps.$values.map((step: any) => ({
                routineStepId: step.routineStepId !== undefined ? step.routineStepId : 0,
                step: step.step !== undefined ? step.step : 0,
                instruction: step.instruction || "",
                // Lấy categoryId từ đối tượng category nếu có
                categoryId: step.category?.categoryId || 0,
              }))
            : [],
        }))
      : [],
  };
};
