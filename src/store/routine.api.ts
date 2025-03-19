import { apiClient, apiEndpoints } from "./utils.api";
import { AllRoutine, Routine } from "../types/Routine";
import { mapApiToRoutine } from "../types/routines.mapping";

// Lấy tất cả Routine
export const getAllRoutines = async (): Promise<AllRoutine[]> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.Routine}/get-all-routine`);
    const data = response.data;
    const routines = data.$values ? data.$values : Array.isArray(data) ? data : [];

    return routines.map((item: any) => ({
      routineId: item.routineId ?? 0,
      routineName: item.routineName ?? "Unknown",
      status: item.status ?? false,
      skinTypeId: item.skinTypeId ?? 0,
      skinTypeName: item.skinTypeName ?? "Unknown",
    }));
  } catch (error) {
    console.error("Error fetching routines:", error);
    throw error;
  }
};


// Lấy Routine theo routineId
export const getRoutineById = async (routineId: number): Promise<Routine> => {
  try {
    const response = await apiClient.get(
      `${apiEndpoints.Routine}/get-routine-by-routine-id-admin?routineId=${routineId}`
    );
    return mapApiToRoutine(response.data);
  } catch (error) {
    console.error("Error fetching routine by id:", error);
    throw error;
  }
};

// Tạo mới Routine
export const createRoutine = async (routine: Routine): Promise<any> => {
  try {
    const payload = {
      routineName: routine.routineName,
      skinTypeId: routine.skinTypeId, // nếu API cần, bạn có thể truyền skinTypeName thay thế
      status: routine.status,
      routineDetails: routine.routineDetails.map((detail) => ({
        routineDetailName: detail.routineDetailName,
        routineSteps: detail.routineSteps.map((step) => ({
          step: step.step,
          instruction: step.instruction,
          categoryId: step.categoryId,
        })),
      })),
    };
    const response = await apiClient.post(`${apiEndpoints.Routine}/create-routine`, payload);
    return response.data;
  } catch (error) {
    console.error("Error creating routine:", error);
    throw error;
  }
};

// Cập nhật Routine
export const updateRoutine = async (routine: Routine): Promise<any> => {
  try {
    const payload = {
      routineId: routine.routineId,
      routineName: routine.routineName,
      skinTypeId: routine.skinTypeId,
      status: routine.status,
      routineDetails: routine.routineDetails.map((detail) => ({
        routineDetailId:detail.routineDetailId,
        routineDetailName: detail.routineDetailName,
        routineSteps: detail.routineSteps.map((step) => ({
          routineStepId:step.routineStepId,
          step: step.step,
          instruction: step.instruction,
          categoryId: step.categoryId,
        })),
      })),
    };
    const response = await apiClient.put(
      `${apiEndpoints.Routine}/update-routine-by-routine-id`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error("Error updating routine:", error);
    throw error;
  }
};

export const getCategories = async (): Promise<any[]> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.Category}/get-categories`);
    // Giả sử API trả về dữ liệu có cấu trúc { "$id": "...", "$values": [ ... ] }
    const data = response.data;
    return data?.$values || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};