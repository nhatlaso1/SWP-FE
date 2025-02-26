import axios from "../utils/axiosConfig";

const BASE_URL = `https://localhost:7130/api`;

export const initialRoutine = {
  skinTypeQuestions: undefined,
  skinType: undefined,
  routineDetail: undefined,
};

export function routineActions(set, get) {
  return {
    determineSkinType: async (answers) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          listUserAnswer: answers,
        };
        const response = await axios.post(
          `${BASE_URL}/SkinTest/determine-skin-type`,
          body
        );
        // Dummy data
        // const response = {
        //   data: {
        //     $id: "1",
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
        //           routineDetailName: "Morning",
        //           routineSteps: {
        //             $id: "5",
        //             $values: [
        //               {
        //                 $id: "6",
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
        //                         productImages: {
        //                           $id: "10",
        //                           $values: [
        //                             {
        //                               $id: "11",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "12",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "13",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "14",
        //                         productId: 2,
        //                         productName: "Product 2",
        //                         summary: "Product 2",
        //                         quantity: 300,
        //                         price: 200000,
        //                         discount: 0.2,
        //                         productImages: {
        //                           $id: "15",
        //                           $values: [
        //                             {
        //                               $id: "16",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "17",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "18",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "19",
        //                         productId: 7,
        //                         productName: "Product 7",
        //                         summary: "Product 7",
        //                         quantity: 70,
        //                         price: 110000,
        //                         discount: 0.1,
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
        //                         productId: 12,
        //                         productName: "Product 12",
        //                         summary: "Product 12",
        //                         quantity: 80,
        //                         price: 160000,
        //                         discount: 0.15,
        //                         productImages: {
        //                           $id: "25",
        //                           $values: [
        //                             {
        //                               $id: "26",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "27",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "28",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "29",
        //                         productId: 17,
        //                         productName: "Product 17",
        //                         summary: "Product 17",
        //                         quantity: 60,
        //                         price: 115000,
        //                         discount: 0.1,
        //                         productImages: {
        //                           $id: "30",
        //                           $values: [
        //                             {
        //                               $id: "31",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "32",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "33",
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
        //                 $id: "34",
        //                 step: 2,
        //                 instruction:
        //                   "Soothing barrier repair moisturizers contain ceramides, fatty acids, and cholesterol to repair and strengthen your skin barrier, as well as anti-inflammatory ingredients to soothe and calm redness, stinging, and other signs of skin irritation. Soothing barrier repair moisturizers are best for dry and sensitive skin types and are safe for rosacea and eczema.",
        //                 category: {
        //                   $id: "35",
        //                   categoryId: 2,
        //                   categoryName: "Moisturizer",
        //                   products: {
        //                     $id: "36",
        //                     $values: [
        //                       {
        //                         $id: "37",
        //                         productId: 3,
        //                         productName: "Product 3",
        //                         summary: "Product 3",
        //                         quantity: 50,
        //                         price: 150000,
        //                         discount: 0.1,
        //                         productImages: {
        //                           $id: "38",
        //                           $values: [
        //                             {
        //                               $id: "39",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "40",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "41",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "42",
        //                         productId: 8,
        //                         productName: "Product 8",
        //                         summary: "Product 8",
        //                         quantity: 90,
        //                         price: 130000,
        //                         discount: 0.25,
        //                         productImages: {
        //                           $id: "43",
        //                           $values: [
        //                             {
        //                               $id: "44",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "45",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "46",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "47",
        //                         productId: 13,
        //                         productName: "Product 13",
        //                         summary: "Product 13",
        //                         quantity: 100,
        //                         price: 105000,
        //                         discount: 0.1,
        //                         productImages: {
        //                           $id: "48",
        //                           $values: [
        //                             {
        //                               $id: "49",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "50",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "51",
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
        //                 $id: "52",
        //                 step: 3,
        //                 instruction:
        //                   "Zinc oxide and iron oxide are the active sunscreen ingredients in physical SPFs. These products also contain moisturizing ingredients, making them ideal for dry or flaky skin. They do not contain parabens, phthalates, or chemical ingredients.",
        //                 category: {
        //                   $id: "53",
        //                   categoryId: 3,
        //                   categoryName: "Serum",
        //                   products: {
        //                     $id: "54",
        //                     $values: [
        //                       {
        //                         $id: "55",
        //                         productId: 4,
        //                         productName: "Product 4",
        //                         summary: "Product 4",
        //                         quantity: 80,
        //                         price: 120000,
        //                         discount: 0.15,
        //                         productImages: {
        //                           $id: "56",
        //                           $values: [
        //                             {
        //                               $id: "57",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "58",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "59",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "60",
        //                         productId: 9,
        //                         productName: "Product 9",
        //                         summary: "Product 9",
        //                         quantity: 40,
        //                         price: 200000,
        //                         discount: 0.3,
        //                         productImages: {
        //                           $id: "61",
        //                           $values: [
        //                             {
        //                               $id: "62",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "63",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "64",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "65",
        //                         productId: 14,
        //                         productName: "Product 14",
        //                         summary: "Product 14",
        //                         quantity: 70,
        //                         price: 125000,
        //                         discount: 0.25,
        //                         productImages: {
        //                           $id: "66",
        //                           $values: [
        //                             {
        //                               $id: "67",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "68",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "69",
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
        //           $id: "70",
        //           routineDetailName: "Evening",
        //           routineSteps: {
        //             $id: "71",
        //             $values: [
        //               {
        //                 $id: "72",
        //                 step: 1,
        //                 instruction:
        //                   "These face washes are ideal for sensitive skin, as they use anti-inflammatory ingredients to soothe and calm red, irritated skin. Smoothing cleansers contain only gentle ingredients that are safe to use with rosacea, eczema, hypersensitive, sensitive and post-procedure skin. These cleansers are the best choice for those struggling with red, flushed skin or when other cleansers cause burning or stinging.",
        //                 category: {
        //                   $id: "73",
        //                   categoryId: 1,
        //                   categoryName: "Cleanser",
        //                   products: {
        //                     $id: "74",
        //                     $values: [
        //                       {
        //                         $id: "75",
        //                         productId: 1,
        //                         productName: "Product 1",
        //                         summary: "Product 1",
        //                         quantity: 100,
        //                         price: 100000,
        //                         discount: 0,
        //                         productImages: {
        //                           $id: "76",
        //                           $values: [
        //                             {
        //                               $id: "77",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "78",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "79",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "80",
        //                         productId: 2,
        //                         productName: "Product 2",
        //                         summary: "Product 2",
        //                         quantity: 300,
        //                         price: 200000,
        //                         discount: 0.2,
        //                         productImages: {
        //                           $id: "81",
        //                           $values: [
        //                             {
        //                               $id: "82",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "83",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "84",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "85",
        //                         productId: 7,
        //                         productName: "Product 7",
        //                         summary: "Product 7",
        //                         quantity: 70,
        //                         price: 110000,
        //                         discount: 0.1,
        //                         productImages: {
        //                           $id: "86",
        //                           $values: [
        //                             {
        //                               $id: "87",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "88",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "89",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "90",
        //                         productId: 12,
        //                         productName: "Product 12",
        //                         summary: "Product 12",
        //                         quantity: 80,
        //                         price: 160000,
        //                         discount: 0.15,
        //                         productImages: {
        //                           $id: "91",
        //                           $values: [
        //                             {
        //                               $id: "92",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "93",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "94",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "95",
        //                         productId: 17,
        //                         productName: "Product 17",
        //                         summary: "Product 17",
        //                         quantity: 60,
        //                         price: 115000,
        //                         discount: 0.1,
        //                         productImages: {
        //                           $id: "96",
        //                           $values: [
        //                             {
        //                               $id: "97",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "98",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "99",
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
        //                 $id: "100",
        //                 step: 2,
        //                 instruction:
        //                   "Soothing barrier repair moisturizers contain ceramides, fatty acids, and cholesterol to repair and strengthen your skin barrier, as well as anti-inflammatory ingredients to soothe and calm redness, stinging, and other signs of skin irritation. Soothing barrier repair moisturizers are best for dry and sensitive skin types and are safe for rosacea and eczema.",
        //                 category: {
        //                   $id: "101",
        //                   categoryId: 2,
        //                   categoryName: "Moisturizer",
        //                   products: {
        //                     $id: "102",
        //                     $values: [
        //                       {
        //                         $id: "103",
        //                         productId: 3,
        //                         productName: "Product 3",
        //                         summary: "Product 3",
        //                         quantity: 50,
        //                         price: 150000,
        //                         discount: 0.1,
        //                         productImages: {
        //                           $id: "104",
        //                           $values: [
        //                             {
        //                               $id: "105",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "106",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "107",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "108",
        //                         productId: 8,
        //                         productName: "Product 8",
        //                         summary: "Product 8",
        //                         quantity: 90,
        //                         price: 130000,
        //                         discount: 0.25,
        //                         productImages: {
        //                           $id: "109",
        //                           $values: [
        //                             {
        //                               $id: "110",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "111",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "112",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                           ],
        //                         },
        //                       },
        //                       {
        //                         $id: "113",
        //                         productId: 13,
        //                         productName: "Product 13",
        //                         summary: "Product 13",
        //                         quantity: 100,
        //                         price: 105000,
        //                         discount: 0.1,
        //                         productImages: {
        //                           $id: "114",
        //                           $values: [
        //                             {
        //                               $id: "115",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "116",
        //                               url: "https://mint07.com/wp-content/uploads/2015/10/sua-rua-mat-Simple-Kind-To-Skin-Refreshing-Facial-Wash-Gel-review-1.jpg",
        //                             },
        //                             {
        //                               $id: "117",
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
      } catch (error) {
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
    fetchQuestionsSkinTest: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.get(
          `${BASE_URL}/SkinTest/get-skin-test?skinTestId=1`
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
        //       ],
        //     },
        //   },
        // };
        set((state) => {
          if (response.data) {
            state.routine.skinTypeQuestions =
              response?.data?.skinTypeQuestions.$values.map((item) => {
                return {
                  question: item.description,
                  options: item.skinTypeAnswers.$values.map((answer) => {
                    return {
                      [answer.skinTypeAnswerId]: answer.description,
                    };
                  }),
                };
              });
          }
        });
      } catch (error) {
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
  };
}
