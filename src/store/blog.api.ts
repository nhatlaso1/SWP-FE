import { Blog } from "../types/blog";
import { apiClient, apiEndpoints } from "./utils.api";

export const getAllBlogs = async (token: string):  Promise<Blog[]> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.blogs}/blogs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data;
    return data?.$values || [];
  } catch (error) {
    console.error("Error fetching all blogs", error);
    throw error;
  }
};