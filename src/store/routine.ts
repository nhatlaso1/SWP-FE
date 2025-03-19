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
        // Dummy data
        // const response = {
        //   data: {
        //     $id: "1",
        //     skinTestId: 1,
        //     skinTestName: "c",
        //     status: true,
        //     skinTypeQuestions: {
        //       $id: "2",
        //       $values: [
        //         {
        //           $id: "3",
        //           skinTypeQuestionId: 1,
        //           type: true,
        //           description:
        //             "Assess your skin moisturization needs ,Please check all that are true about how often you must use a moisturizer for your skin to feel hydrated. (Multiple answers are preferred.)",
        //           skinTypeAnswers: {
        //             $id: "4",
        //             $values: [
        //               {
        //                 $id: "5",
        //                 skinTypeAnswerId: 1,
        //                 description:
        //                   "I can use any soap to wash my face without developing dryness.",
        //                 skinTypeId: 1,
        //               },
        //               {
        //                 $id: "6",
        //                 skinTypeAnswerId: 2,
        //                 description:
        //                   "I do not apply any products to my facial skin after cleansing.",
        //                 skinTypeId: 4,
        //               },
        //               {
        //                 $id: "7",
        //                 skinTypeAnswerId: 3,
        //                 description:
        //                   "I never or only occasionally apply a moisturizer.",
        //                 skinTypeId: 2,
        //               },
        //               {
        //                 $id: "8",
        //                 skinTypeAnswerId: 4,
        //                 description:
        //                   "I apply a moisturizer to my face once a day.",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "9",
        //                 skinTypeAnswerId: 5,
        //                 description:
        //                   "I apply a moisturizer to my face twice a day.",
        //                 skinTypeId: 5,
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "10",
        //           skinTypeQuestionId: 2,
        //           type: true,
        //           description:
        //             "Assess your skin's sebum production.Please check all that are true about your facial skin. (Multiple answers are preferred.)",
        //           skinTypeAnswers: {
        //             $id: "11",
        //             $values: [
        //               {
        //                 $id: "12",
        //                 skinTypeAnswerId: 6,
        //                 description: "My facial skin is rough or dry",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "13",
        //                 skinTypeAnswerId: 7,
        //                 description: "My facial skin is oily in some areas",
        //                 skinTypeId: 2,
        //               },
        //               {
        //                 $id: "14",
        //                 skinTypeAnswerId: 8,
        //                 description: "My face is very oily.",
        //                 skinTypeId: 1,
        //               },
        //               {
        //                 $id: "15",
        //                 skinTypeAnswerId: 9,
        //                 description:
        //                   "My face is uncomfortable if I do not use a moisturizer",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "16",
        //                 skinTypeAnswerId: 10,
        //                 description:
        //                   "I like the feel of heavy creams and/or oil on my skin",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "17",
        //                 skinTypeAnswerId: 11,
        //                 description: "None of the above",
        //                 skinTypeId: 4,
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "18",
        //           skinTypeQuestionId: 3,
        //           type: true,
        //           description:
        //             "Assess your skin's underlying inflammation.Check all the following that you have had in the last 4 weeks: (Multiple answers allowed)",
        //           skinTypeAnswers: {
        //             $id: "19",
        //             $values: [
        //               {
        //                 $id: "20",
        //                 skinTypeAnswerId: 12,
        //                 description: "Acne (pimples)",
        //                 skinTypeId: 1,
        //               },
        //               {
        //                 $id: "21",
        //                 skinTypeAnswerId: 13,
        //                 description: "Facial redness and/or flushing",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "22",
        //                 skinTypeAnswerId: 14,
        //                 description: "Stinging or burning",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "23",
        //                 skinTypeAnswerId: 15,
        //                 description: "A rash with itching, scaling and redness",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "24",
        //                 skinTypeAnswerId: 16,
        //                 description: "Irritation from shaving the face",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "25",
        //                 skinTypeAnswerId: 17,
        //                 description: "None of the above",
        //                 skinTypeId: 4,
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "26",
        //           skinTypeQuestionId: 4,
        //           type: false,
        //           description:
        //             "Do you want to lighten dark spots on your skin?Do you want skin lighteners in your skin care products to treat hyper pigmentation? (Choose one answer)",
        //           skinTypeAnswers: {
        //             $id: "27",
        //             $values: [
        //               {
        //                 $id: "28",
        //                 skinTypeAnswerId: 29,
        //                 description:
        //                   "My skin pigment is uneven AND I want to lighten darker areas on my face",
        //                 skinTypeId: 2,
        //               },
        //               {
        //                 $id: "29",
        //                 skinTypeAnswerId: 30,
        //                 description:
        //                   "My skin pigment is even AND I have no dark spots or darker areas",
        //                 skinTypeId: 4,
        //               },
        //               {
        //                 $id: "30",
        //                 skinTypeAnswerId: 31,
        //                 description:
        //                   "I have freckles or dark spots AND I do not want to remove",
        //                 skinTypeId: 4,
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "31",
        //           skinTypeQuestionId: 5,
        //           type: true,
        //           description:
        //             "Lifestyle habits Check all that apply to you. (Multiple answers allowed)",
        //           skinTypeAnswers: {
        //             $id: "32",
        //             $values: [
        //               {
        //                 $id: "33",
        //                 skinTypeAnswerId: 32,
        //                 description: "I currently smoke cigarettes or cigars",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "34",
        //                 skinTypeAnswerId: 33,
        //                 description:
        //                   "I have smoked over 50 cigarettes or cigars in my life",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "35",
        //                 skinTypeAnswerId: 34,
        //                 description:
        //                   "I am exposed to second-hand smoke on a weekly basis",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "36",
        //                 skinTypeAnswerId: 35,
        //                 description:
        //                   "I often get less than 7 hours of sleep a night",
        //                 skinTypeId: 1,
        //               },
        //               {
        //                 $id: "37",
        //                 skinTypeAnswerId: 36,
        //                 description: "I feel stress at least 2 hours a day",
        //                 skinTypeId: 1,
        //               },
        //               {
        //                 $id: "38",
        //                 skinTypeAnswerId: 37,
        //                 description:
        //                   "Are you exposed to pollution or bad air quality more than 3 times a week?",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "39",
        //                 skinTypeAnswerId: 38,
        //                 description: "I eat sugary foods over 3 times a week",
        //                 skinTypeId: 1,
        //               },
        //               {
        //                 $id: "40",
        //                 skinTypeAnswerId: 39,
        //                 description: "I exercise less than 3 hours a week.",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "41",
        //                 skinTypeAnswerId: 40,
        //                 description:
        //                   "I do not eat fruit or vegetables every day.",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "42",
        //                 skinTypeAnswerId: 41,
        //                 description: "None of the above",
        //                 skinTypeId: 4,
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "43",
        //           skinTypeQuestionId: 6,
        //           type: true,
        //           description:
        //             "Suncare Habits.Check all that apply to you. (Multiple answers allowed)",
        //           skinTypeAnswers: {
        //             $id: "44",
        //             $values: [
        //               {
        //                 $id: "45",
        //                 skinTypeAnswerId: 42,
        //                 description:
        //                   "I have been to a tanning bed more than 3 times in my life.",
        //                 skinTypeId: 4,
        //               },
        //               {
        //                 $id: "46",
        //                 skinTypeAnswerId: 43,
        //                 description:
        //                   "I am exposed to the sun for over 3 hours a week.",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "47",
        //                 skinTypeAnswerId: 44,
        //                 description:
        //                   "I spend over 3 hours a week close to a window during daylight hours (including driving).",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "48",
        //                 skinTypeAnswerId: 45,
        //                 description:
        //                   "My face has been sunburned and peeled more than twice in my life.",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "49",
        //                 skinTypeAnswerId: 46,
        //                 description:
        //                   "I do not take daily antioxidant supplements like vitamin E and C.",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "50",
        //                 skinTypeAnswerId: 47,
        //                 description:
        //                   "One of my parents has more wrinkles than others their age.",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "51",
        //                 skinTypeAnswerId: 48,
        //                 description: "I do not wear sunscreen every day",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "52",
        //                 skinTypeAnswerId: 49,
        //                 description:
        //                   "I do not wear sunscreen during outdoor activities",
        //                 skinTypeId: 3,
        //               },
        //               {
        //                 $id: "53",
        //                 skinTypeAnswerId: 50,
        //                 description: "None of the above",
        //                 skinTypeId: 4,
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "54",
        //           skinTypeQuestionId: 14,
        //           type: true,
        //           description: "Assessing Oil and Moisture Levels on Your Skin",
        //           skinTypeAnswers: {
        //             $id: "55",
        //             $values: [
        //               {
        //                 $id: "56",
        //                 skinTypeAnswerId: 18,
        //                 description:
        //                   "My skin feels oily, especially in the T-zone (forehead, nose, chin).",
        //                 skinTypeId: 1,
        //               },
        //               {
        //                 $id: "57",
        //                 skinTypeAnswerId: 19,
        //                 description:
        //                   "My skin feels dry, tight, and lacking moisture.",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "58",
        //                 skinTypeAnswerId: 20,
        //                 description:
        //                   "My skin feels dry in some areas (cheeks) and oily in others (T-zone).",
        //                 skinTypeId: 2,
        //               },
        //               {
        //                 $id: "59",
        //                 skinTypeAnswerId: 21,
        //                 description:
        //                   "My skin feels soft, neither too oily nor too dry.",
        //                 skinTypeId: 4,
        //               },
        //               {
        //                 $id: "60",
        //                 skinTypeAnswerId: 22,
        //                 description:
        //                   "My skin feels easily irritated, itchy, and shows redness or rashes.",
        //                 skinTypeId: 3,
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "61",
        //           skinTypeQuestionId: 15,
        //           type: false,
        //           description: "How does your skin feel throughout the day?",
        //           skinTypeAnswers: {
        //             $id: "62",
        //             $values: [
        //               {
        //                 $id: "63",
        //                 skinTypeAnswerId: 23,
        //                 description:
        //                   "My skin gets oily by midday, especially in the T-zone (forehead, nose, chin), and I often need to blot it.",
        //                 skinTypeId: 1,
        //               },
        //               {
        //                 $id: "64",
        //                 skinTypeAnswerId: 24,
        //                 description:
        //                   "My skin feels comfortable all day—neither too oily nor too dry.",
        //                 skinTypeId: 2,
        //               },
        //               {
        //                 $id: "65",
        //                 skinTypeAnswerId: 25,
        //                 description:
        //                   "My skin feels dry and rough, with visible fine lines or wrinkles, especially as the day goes on.",
        //                 skinTypeId: 5,
        //               },
        //               {
        //                 $id: "66",
        //                 skinTypeAnswerId: 26,
        //                 description:
        //                   "My skin is oily in some areas (like my forehead and nose) but dry in others (like my cheeks).",
        //                 skinTypeId: 2,
        //               },
        //               {
        //                 $id: "67",
        //                 skinTypeAnswerId: 27,
        //                 description:
        //                   "My skin feels comfortable all day—neither too oily nor too dry.",
        //                 skinTypeId: 4,
        //               },
        //               {
        //                 $id: "68",
        //                 skinTypeAnswerId: 28,
        //                 description:
        //                   "My skin becomes irritated, red, or itchy, especially if I use certain products or when the weather changes.",
        //                 skinTypeId: 3,
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "69",
        //           skinTypeQuestionId: 16,
        //           type: true,
        //           description: "string",
        //           skinTypeAnswers: {
        //             $id: "70",
        //             $values: [],
        //           },
        //         },
        //       ],
        //     },
        //   },
        // };
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
        // Dummy data
        // const response = {
        //   data: {
        //     $id: "1",
        //     routineId: 1,
        //     routineName: "routine cho da Khô",
        //     status: true,
        //     skinType: {
        //       $id: "2",
        //       skinTypeId: 5,
        //       skinTypeName: "Dry skin",
        //     },
        //     routineDetails: {
        //       $id: "3",
        //       $values: [
        //         {
        //           $id: "4",
        //           routineDetailId: 1,
        //           routineDetailName: "Morning",
        //           routineSteps: {
        //             $id: "5",
        //             $values: [
        //               {
        //                 $id: "6",
        //                 routineStepId: 1,
        //                 step: 1,
        //                 instruction:
        //                   "These face washes are ideal for sensitive skin, as they use anti-inflammatory ingredients to soothe and calm red, irritated skin. Smoothing cleansers contain only gentle ingredients that are safe to use with rosacea, eczema, hypersensitive, sensitive and post-procedure skin. These cleansers are the best choice for those struggling with red, flushed skin or when other cleansers cause burning or stinging.",
        //                 category: {
        //                   $id: "7",
        //                   categoryId: 1,
        //                   categoryName: "Cleanser",
        //                   products: {
        //                     $id: "8",
        //                     $values: [
        //                       {
        //                         $id: "9",
        //                         productId: 1,
        //                         productName: "Product 1",
        //                         summary: "Product 1",
        //                         quantity: 100,
        //                         price: 100000,
        //                         discount: 0,
        //                         ingredients: {
        //                           $id: "10",
        //                           $values: [
        //                             {
        //                               $id: "11",
        //                               ingredientId: 1,
        //                               ingredientName: "Hyaluronic Acid",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "12",
        //                           $values: [
        //                             {
        //                               $id: "13",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "14",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "15",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "16",
        //                         productId: 2,
        //                         productName: "Product 2",
        //                         summary: "Product 2",
        //                         quantity: 300,
        //                         price: 200000,
        //                         discount: 0.2,
        //                         ingredients: {
        //                           $id: "17",
        //                           $values: [
        //                             {
        //                               $id: "18",
        //                               ingredientId: 2,
        //                               ingredientName: "Niacinamide",
        //                             },
        //                             {
        //                               $id: "19",
        //                               ingredientId: 4,
        //                               ingredientName: "Salicylic Acid",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "20",
        //                           $values: [
        //                             {
        //                               $id: "21",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "22",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "23",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "24",
        //                         productId: 7,
        //                         productName: "Product 7",
        //                         summary: "Product 7",
        //                         quantity: 70,
        //                         price: 110000,
        //                         discount: 0.1,
        //                         ingredients: {
        //                           $id: "25",
        //                           $values: [
        //                             {
        //                               $id: "26",
        //                               ingredientId: 12,
        //                               ingredientName: "Lactic Acid",
        //                             },
        //                             {
        //                               $id: "27",
        //                               ingredientId: 13,
        //                               ingredientName: "Zinc Oxide",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "28",
        //                           $values: [
        //                             {
        //                               $id: "29",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "30",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "31",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "32",
        //                         productId: 12,
        //                         productName: "Product 12",
        //                         summary: "Product 12",
        //                         quantity: 80,
        //                         price: 160000,
        //                         discount: 0.15,
        //                         ingredients: {
        //                           $id: "33",
        //                           $values: [
        //                             {
        //                               $id: "34",
        //                               ingredientId: 2,
        //                               ingredientName: "Niacinamide",
        //                             },
        //                             {
        //                               $id: "35",
        //                               ingredientId: 3,
        //                               ingredientName: "Vitamin C",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "36",
        //                           $values: [
        //                             {
        //                               $id: "37",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "38",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "39",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "40",
        //                         productId: 17,
        //                         productName: "Product 17",
        //                         summary: "Product 17",
        //                         quantity: 60,
        //                         price: 115000,
        //                         discount: 0.1,
        //                         ingredients: {
        //                           $id: "41",
        //                           $values: [
        //                             {
        //                               $id: "42",
        //                               ingredientId: 12,
        //                               ingredientName: "Lactic Acid",
        //                             },
        //                             {
        //                               $id: "43",
        //                               ingredientId: 13,
        //                               ingredientName: "Zinc Oxide",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "44",
        //                           $values: [
        //                             {
        //                               $id: "45",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "46",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "47",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                     ],
        //                   },
        //                 },
        //               },
        //               {
        //                 $id: "48",
        //                 routineStepId: 2,
        //                 step: 2,
        //                 instruction:
        //                   "Soothing barrier repair moisturizers contain ceramides, fatty acids, and cholesterol to repair and strengthen your skin barrier, as well as anti-inflammatory ingredients to soothe and calm redness, stinging, and other signs of skin irritation. Soothing barrier repair moisturizers are best for dry and sensitive skin types and are safe for rosacea and eczema.",
        //                 category: {
        //                   $id: "49",
        //                   categoryId: 2,
        //                   categoryName: "Moisturizer",
        //                   products: {
        //                     $id: "50",
        //                     $values: [
        //                       {
        //                         $id: "51",
        //                         productId: 3,
        //                         productName: "Product 3",
        //                         summary: "Product 3",
        //                         quantity: 50,
        //                         price: 150000,
        //                         discount: 0.1,
        //                         ingredients: {
        //                           $id: "52",
        //                           $values: [
        //                             {
        //                               $id: "53",
        //                               ingredientId: 3,
        //                               ingredientName: "Vitamin C",
        //                             },
        //                             {
        //                               $id: "54",
        //                               ingredientId: 5,
        //                               ingredientName: "Retinol",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "55",
        //                           $values: [
        //                             {
        //                               $id: "56",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "57",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "58",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "59",
        //                         productId: 8,
        //                         productName: "Product 8",
        //                         summary: "Product 8",
        //                         quantity: 90,
        //                         price: 130000,
        //                         discount: 0.25,
        //                         ingredients: {
        //                           $id: "60",
        //                           $values: [
        //                             {
        //                               $id: "61",
        //                               ingredientId: 14,
        //                               ingredientName: "Shea Butter",
        //                             },
        //                             {
        //                               $id: "62",
        //                               ingredientId: 15,
        //                               ingredientName: "Squalane",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "63",
        //                           $values: [
        //                             {
        //                               $id: "64",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "65",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "66",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "67",
        //                         productId: 13,
        //                         productName: "Product 13",
        //                         summary: "Product 13",
        //                         quantity: 100,
        //                         price: 105000,
        //                         discount: 0.1,
        //                         ingredients: {
        //                           $id: "68",
        //                           $values: [
        //                             {
        //                               $id: "69",
        //                               ingredientId: 4,
        //                               ingredientName: "Salicylic Acid",
        //                             },
        //                             {
        //                               $id: "70",
        //                               ingredientId: 5,
        //                               ingredientName: "Retinol",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "71",
        //                           $values: [
        //                             {
        //                               $id: "72",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "73",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "74",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                     ],
        //                   },
        //                 },
        //               },
        //               {
        //                 $id: "75",
        //                 routineStepId: 3,
        //                 step: 3,
        //                 instruction:
        //                   "Zinc oxide and iron oxide are the active sunscreen ingredients in physical SPFs. These products also contain moisturizing ingredients, making them ideal for dry or flaky skin. They do not contain parabens, phthalates, or chemical ingredients.",
        //                 category: {
        //                   $id: "76",
        //                   categoryId: 3,
        //                   categoryName: "Serum",
        //                   products: {
        //                     $id: "77",
        //                     $values: [
        //                       {
        //                         $id: "78",
        //                         productId: 4,
        //                         productName: "Product 4",
        //                         summary: "Product 4",
        //                         quantity: 80,
        //                         price: 120000,
        //                         discount: 0.15,
        //                         ingredients: {
        //                           $id: "79",
        //                           $values: [
        //                             {
        //                               $id: "80",
        //                               ingredientId: 6,
        //                               ingredientName: "Aloe Vera Extract",
        //                             },
        //                             {
        //                               $id: "81",
        //                               ingredientId: 7,
        //                               ingredientName: "Green Tea Extract",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "82",
        //                           $values: [
        //                             {
        //                               $id: "83",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "84",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "85",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "86",
        //                         productId: 9,
        //                         productName: "Product 9",
        //                         summary: "Product 9",
        //                         quantity: 40,
        //                         price: 200000,
        //                         discount: 0.3,
        //                         ingredients: {
        //                           $id: "87",
        //                           $values: [
        //                             {
        //                               $id: "88",
        //                               ingredientId: 16,
        //                               ingredientName: "Tea Tree Oil",
        //                             },
        //                             {
        //                               $id: "89",
        //                               ingredientId: 17,
        //                               ingredientName:
        //                                 "Centella Asiatica Extract",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "90",
        //                           $values: [
        //                             {
        //                               $id: "91",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "92",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "93",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "94",
        //                         productId: 14,
        //                         productName: "Product 14",
        //                         summary: "Product 14",
        //                         quantity: 70,
        //                         price: 125000,
        //                         discount: 0.25,
        //                         ingredients: {
        //                           $id: "95",
        //                           $values: [
        //                             {
        //                               $id: "96",
        //                               ingredientId: 6,
        //                               ingredientName: "Aloe Vera Extract",
        //                             },
        //                             {
        //                               $id: "97",
        //                               ingredientId: 7,
        //                               ingredientName: "Green Tea Extract",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "98",
        //                           $values: [
        //                             {
        //                               $id: "99",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "100",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "101",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                     ],
        //                   },
        //                 },
        //               },
        //             ],
        //           },
        //         },
        //         {
        //           $id: "102",
        //           routineDetailId: 2,
        //           routineDetailName: "Evening",
        //           routineSteps: {
        //             $id: "103",
        //             $values: [
        //               {
        //                 $id: "104",
        //                 routineStepId: 4,
        //                 step: 1,
        //                 instruction:
        //                   "These face washes are ideal for sensitive skin, as they use anti-inflammatory ingredients to soothe and calm red, irritated skin. Smoothing cleansers contain only gentle ingredients that are safe to use with rosacea, eczema, hypersensitive, sensitive and post-procedure skin. These cleansers are the best choice for those struggling with red, flushed skin or when other cleansers cause burning or stinging.",
        //                 category: {
        //                   $id: "105",
        //                   categoryId: 1,
        //                   categoryName: "Cleanser",
        //                   products: {
        //                     $id: "106",
        //                     $values: [
        //                       {
        //                         $id: "107",
        //                         productId: 1,
        //                         productName: "Product 1",
        //                         summary: "Product 1",
        //                         quantity: 100,
        //                         price: 100000,
        //                         discount: 0,
        //                         ingredients: {
        //                           $id: "108",
        //                           $values: [
        //                             {
        //                               $id: "109",
        //                               ingredientId: 1,
        //                               ingredientName: "Hyaluronic Acid",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "110",
        //                           $values: [
        //                             {
        //                               $id: "111",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "112",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "113",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "114",
        //                         productId: 2,
        //                         productName: "Product 2",
        //                         summary: "Product 2",
        //                         quantity: 300,
        //                         price: 200000,
        //                         discount: 0.2,
        //                         ingredients: {
        //                           $id: "115",
        //                           $values: [
        //                             {
        //                               $id: "116",
        //                               ingredientId: 2,
        //                               ingredientName: "Niacinamide",
        //                             },
        //                             {
        //                               $id: "117",
        //                               ingredientId: 4,
        //                               ingredientName: "Salicylic Acid",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "118",
        //                           $values: [
        //                             {
        //                               $id: "119",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "120",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "121",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "122",
        //                         productId: 7,
        //                         productName: "Product 7",
        //                         summary: "Product 7",
        //                         quantity: 70,
        //                         price: 110000,
        //                         discount: 0.1,
        //                         ingredients: {
        //                           $id: "123",
        //                           $values: [
        //                             {
        //                               $id: "124",
        //                               ingredientId: 12,
        //                               ingredientName: "Lactic Acid",
        //                             },
        //                             {
        //                               $id: "125",
        //                               ingredientId: 13,
        //                               ingredientName: "Zinc Oxide",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "126",
        //                           $values: [
        //                             {
        //                               $id: "127",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "128",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "129",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "130",
        //                         productId: 12,
        //                         productName: "Product 12",
        //                         summary: "Product 12",
        //                         quantity: 80,
        //                         price: 160000,
        //                         discount: 0.15,
        //                         ingredients: {
        //                           $id: "131",
        //                           $values: [
        //                             {
        //                               $id: "132",
        //                               ingredientId: 2,
        //                               ingredientName: "Niacinamide",
        //                             },
        //                             {
        //                               $id: "133",
        //                               ingredientId: 3,
        //                               ingredientName: "Vitamin C",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "134",
        //                           $values: [
        //                             {
        //                               $id: "135",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "136",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "137",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "138",
        //                         productId: 17,
        //                         productName: "Product 17",
        //                         summary: "Product 17",
        //                         quantity: 60,
        //                         price: 115000,
        //                         discount: 0.1,
        //                         ingredients: {
        //                           $id: "139",
        //                           $values: [
        //                             {
        //                               $id: "140",
        //                               ingredientId: 12,
        //                               ingredientName: "Lactic Acid",
        //                             },
        //                             {
        //                               $id: "141",
        //                               ingredientId: 13,
        //                               ingredientName: "Zinc Oxide",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "142",
        //                           $values: [
        //                             {
        //                               $id: "143",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "144",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "145",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                     ],
        //                   },
        //                 },
        //               },
        //               {
        //                 $id: "146",
        //                 routineStepId: 5,
        //                 step: 2,
        //                 instruction:
        //                   "Soothing barrier repair moisturizers contain ceramides, fatty acids, and cholesterol to repair and strengthen your skin barrier, as well as anti-inflammatory ingredients to soothe and calm redness, stinging, and other signs of skin irritation. Soothing barrier repair moisturizers are best for dry and sensitive skin types and are safe for rosacea and eczema.",
        //                 category: {
        //                   $id: "147",
        //                   categoryId: 2,
        //                   categoryName: "Moisturizer",
        //                   products: {
        //                     $id: "148",
        //                     $values: [
        //                       {
        //                         $id: "149",
        //                         productId: 3,
        //                         productName: "Product 3",
        //                         summary: "Product 3",
        //                         quantity: 50,
        //                         price: 150000,
        //                         discount: 0.1,
        //                         ingredients: {
        //                           $id: "150",
        //                           $values: [
        //                             {
        //                               $id: "151",
        //                               ingredientId: 3,
        //                               ingredientName: "Vitamin C",
        //                             },
        //                             {
        //                               $id: "152",
        //                               ingredientId: 5,
        //                               ingredientName: "Retinol",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "153",
        //                           $values: [
        //                             {
        //                               $id: "154",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "155",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "156",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "157",
        //                         productId: 8,
        //                         productName: "Product 8",
        //                         summary: "Product 8",
        //                         quantity: 90,
        //                         price: 130000,
        //                         discount: 0.25,
        //                         ingredients: {
        //                           $id: "158",
        //                           $values: [
        //                             {
        //                               $id: "159",
        //                               ingredientId: 14,
        //                               ingredientName: "Shea Butter",
        //                             },
        //                             {
        //                               $id: "160",
        //                               ingredientId: 15,
        //                               ingredientName: "Squalane",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "161",
        //                           $values: [
        //                             {
        //                               $id: "162",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "163",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "164",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "165",
        //                         productId: 13,
        //                         productName: "Product 13",
        //                         summary: "Product 13",
        //                         quantity: 100,
        //                         price: 105000,
        //                         discount: 0.1,
        //                         ingredients: {
        //                           $id: "166",
        //                           $values: [
        //                             {
        //                               $id: "167",
        //                               ingredientId: 4,
        //                               ingredientName: "Salicylic Acid",
        //                             },
        //                             {
        //                               $id: "168",
        //                               ingredientId: 5,
        //                               ingredientName: "Retinol",
        //                             },
        //                           ],
        //                         },
        //                         productImages: {
        //                           $id: "169",
        //                           $values: [
        //                             {
        //                               $id: "170",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "171",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "172",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                     ],
        //                   },
        //                 },
        //               },
        //             ],
        //           },
        //         },
        //       ],
        //     },
        //   },
        // };
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
