import axios, { AxiosInstance } from "axios";

const apiBaseUrl: string =
  "https://beautysc-api.purpleforest-f01817f2.southeastasia.azurecontainerapps.io/api";

export const apiEndpoints = {
  SkinTest: "SkinTest",
  Customer: "Customer",
  Order: "Order",
  Payment: "Payment",
  SkinType: "SkinType",
  Routine: "Routine",
  Category: "Category",
  Voucher: "Voucher",
  Feedback: "Feedback",
  Product: "Product",
  Authentication: "Authentication",
} as const;

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Authorization: `${
      localStorage.getItem("token")
        ? `Bearer ${localStorage.getItem("token")}`
        : ""
    }`,
  },
});

export const setAuthToken = (token: string | null): void => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};
