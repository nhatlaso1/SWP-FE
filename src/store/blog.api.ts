
import { Blog, BlogPost, Blogs } from "../types/blog";
import { apiClient, apiEndpoints } from "./utils.api";

export const getAllBlogs = async (): Promise<Blogs[]> => {
  try {


    const response = await apiClient.get(`${apiEndpoints.blogs}/blogs`, {
      // headers: { Authorization: `Bearer ${token}` },
    });

    console.log("API Response:", response.data); // Debug API Response

    return response.data?.$values || [];
  } catch (error) {
    console.error("Error fetching all blogs", error);
    return [];
  }
};

export const getBlogById = async (blogId: number, token: string): Promise<Blog | null> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.blogs}/blog/${blogId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data || null; // Trả về null nếu không có dữ liệu
  } catch (error) {
    console.error("Error fetching blog by ID", error);
    return null;
  }
};



// Lấy blog theo ID (Admin)
export const getBlogByIdAdmin = async (blogId: number, token: string): Promise<Blog | null> => {
  try {
    const response = await apiClient.get(`${apiEndpoints.blogs}/blog/${blogId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching blog by ID:", error);
    throw new Error("Failed to fetch blog");
  }
};

// Tạo mới Blog
export const createBlog = async (blog: any, token: string): Promise<void> => {
  try {
    const response = await apiClient.post(`${apiEndpoints.blogs}`, blog, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Blog created successfully", response.data);
  } catch (error) {
    console.error("Error creating blog:", error);
    throw new Error("Failed to create blog");
  }
};

export const mapApiToBlog = (data: Blog) => {
  return {
    blogTitle: data.blogTitle || "",
    blogImage: data.blogImage || "",
    status: data.status,
    blogDetails:
      data.blogDetails && Array.isArray(data.blogDetails.$values)
        ? data.blogDetails.$values.map((detail, index) => ({
          blogDetailId: detail.blogDetailId || Date.now() + index, // Định danh của backend
          id: detail.blogDetailId || Date.now() + index,             // Dùng làm key cho UI
          title: detail.blogDetailTitle || "",                      // Đổi key thành title
          description: detail.description || "",
          image: detail.blogDetailImage || "",                      // Đổi key thành image
        }))
        : [],
  };
};


// Cập nhật Blog
export const updateBlog = async (blogId: number, blog: any, token: string): Promise<void> => {
  try {
    const response = await apiClient.put(`${apiEndpoints.blogs}/blog/${blogId}`, blog, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Blog updated successfully", response.data);
  } catch (error) {
    console.error("Error updating blog:", error);
    throw new Error("Failed to update blog");
  }
};