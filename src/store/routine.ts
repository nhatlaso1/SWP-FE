import type { StoreGet, StoreSet } from "../store";
import { apiClient, apiEndpoints } from "./utils.api";

export interface RoutineState {
  skinTypeQuestions: any;
  skinType: any;
  routineDetail: any;
  step: any;
}

export interface RoutineActions {
  determineSkinType: (item: any) => void;
  fetchQuestionsSkinTest: (id: any) => void;
  fetchRoutine: (skinTypeId: number) => void;
  setStep: (step: number) => void;
}

export const initialRoutine: RoutineState = {
  skinTypeQuestions: undefined,
  skinType: undefined,
  routineDetail: undefined,
  step: 1,
};

export function routineActions(set: StoreSet, get: StoreGet): RoutineActions {
  return {
    determineSkinType: async (answers) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          listUserAnswer: answers,
        };
        const response = await apiClient.post(
          `${apiEndpoints.SkinTest}/determine-skin-type`,
          body
        );
        // Dummy data
        // const response = {
        //   data: {
        //     $id: "1",
        //     skinTypeId: 5,
        //     skinTypeName: "Dry skin",
        //   },
        // };
        await get().fetchRoutine(response.data.skinTypeId);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    fetchQuestionsSkinTest: async (id: number) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await apiClient.get(
          `${apiEndpoints.SkinTest}/get-skin-test?skinTestId=${id}`
        );
        set((state) => {
          if (response.data) {
            state.routine.skinTypeQuestions =
              response?.data?.skinTypeQuestions.$values.map((item: any) => {
                return {
                  question: item.description,
                  options: item.skinTypeAnswers.$values.map((answer: any) => {
                    return {
                      [answer.skinTypeAnswerId]: answer.description,
                    };
                  }),
                };
              });
          }
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    fetchRoutine: async (skinTypeId: number) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await apiClient.get(
          `${apiEndpoints.Routine}/get-routine-by-skin-type-id?skinTypeId=${skinTypeId}`
        );
        set((state) => {
          state.routine.skinType = response.data?.skinType || undefined;
          state.routine.routineDetail =
            response.data?.routineDetails.$values || undefined;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    setStep: (step: number) => {
      set((state) => {
        state.routine.step = step;
      });
    },
  };
}
