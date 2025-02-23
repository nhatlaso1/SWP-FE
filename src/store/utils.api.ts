import axios, { AxiosInstance } from "axios";

const apiBaseUrl: string = "https://localhost:7130/api";

export const apiEndpoints = {
  SkinTest: "SkinTest",
  Customer: "Customer",
  Order: "Order",
} as const;

export const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseUrl,
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
