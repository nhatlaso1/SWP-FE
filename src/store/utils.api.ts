import axios, { AxiosInstance } from "axios";

const API_URL: string = "https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api";

export const apiEndpoints = {
  SkinTest: "SkinTest",
  Customer: "Customer",
  Order: "Order",
  Payment:"Payment",
  SkinType: "SkinType",
  Routine: "Routine",
  Category:"Category",
  Voucher:"Voucher",
  Feedback:"Feedback",
} as const;

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const setAuthToken = (token: string | null): void => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
