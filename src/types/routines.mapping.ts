import { Routine } from "./Routine";

// Hàm ánh xạ từ API sang Routine nội bộ, gán giá trị mặc định nếu trường bị thiếu
export const mapApiToRoutine = (apiData: any): Routine => {
  return {
    routineId: apiData.routineId !== undefined ? apiData.routineId : 0,
    routineName: apiData.routineName || "",
    // API chỉ trả về skinTypeName, không có skinTypeId, nên ta gán skinTypeId mặc định là 0
    skinTypeId: 0,
    skinTypeName: apiData.skinTypeName || "",
    routineDetails: Array.isArray(apiData.routineDetails?.$values)
      ? apiData.routineDetails.$values.map((detail: any) => ({
          routineDetailName: detail.routineDetailName || "",
          routineSteps: Array.isArray(detail.routineSteps?.$values)
            ? detail.routineSteps.$values.map((step: any) => ({
                step: step.step !== undefined ? step.step : 0,
                instruction: step.instruction || "",
                categoryId: step.categoryId !== undefined ? step.categoryId : 0,
              }))
            : [],
        }))
      : [],
  };
};
