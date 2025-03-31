import { ApiResponse, Customer } from "../types/user";
import { apiClient, apiEndpoints } from "./utils.api";

export const getAllCustomer = async (token: string): Promise<Customer[]> => {
    try {
      const response = await apiClient.get<ApiResponse>(`${apiEndpoints.Customer}/customers`,
        { headers: { Authorization: `Bearer ${token}` } }
       );
  
      console.log("API Response:", response.data);
  
      if (!response.data || !Array.isArray(response.data.$values)) {
        throw new Error("Invalid API response format");
      }
  
      return response.data.$values.map(({ skinType, ...customer }) => ({
        ...customer,
        skinType: skinType
          ? {
              skinTypeId: skinType.skinTypeId,
              skinTypeName: skinType.skinTypeName,
              priority: skinType.priority
            }
          : null // Nếu không có skinType thì để null
      }));
  
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  };
  
  export const activeAccount = async (token: string,userId :number): Promise<string> => {
    try {
      const response = await apiClient.patch<string>(`${apiEndpoints.Customer}/active-customer?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
       );
  
      console.log("API Response:", response.data);
  
      if (!response.data) {
        throw new Error("Invalid API response format");
      }
  
      return response.data;
    
  
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  };
  export const deActiveAccount = async (token: string,userId :number): Promise<string> => {
    try {
      const response = await apiClient.patch<string>(`${apiEndpoints.Customer}/deactive-customer?userId=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
       );
  
      console.log("API Response:", response.data);
  
      if (!response.data) {
        throw new Error("Invalid API response format");
      }
  
      return response.data;
    
  
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error;
    }
  };
  