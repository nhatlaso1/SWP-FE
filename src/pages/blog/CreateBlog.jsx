import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Box,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  createBlog,
  getBlogByIdAdmin,
  mapApiToBlog,
  updateBlog,
} from "../../store/blog.api";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { blogId } = useParams(); // Lấy blogId từ URL nếu có
  const token = localStorage.getItem("token");

  // Khởi tạo state theo cấu trúc nội bộ
  const [blogPost, setBlogPost] = useState({
    blogTitle: "",
    blogImage: "",
    status: true,
    blogDetails: [],
  });

  // Nếu có blogId, tải dữ liệu blog để cập nhật
  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    try {
      const data = await getBlogByIdAdmin(Number(blogId), token);
      const formattedData = mapApiToBlog(data);
      setBlogPost(formattedData);
    } catch (error) {
      console.error("Error fetching blog:", error);
    }
  };

  // Hàm thay đổi dữ liệu blog chung
  const handleChange = (field, value) => {
    setBlogPost((prev) => ({ ...prev, [field]: value }));
  };

  // Thêm Blog Detail mới
  const handleAddBlogPostDetail = () => {
    setBlogPost((prev) => ({
      ...prev,
      blogDetails: [
        ...prev.blogDetails,
        {
          id: Date.now(),         // Dùng cho React key
          blogDetailId: null,       // Mới tạo, chưa có định danh từ backend
          title: "",              // Dùng trong UI
          description: "",
          image: "",
        },
      ],
    }));
  };

  // Xóa Blog Detail theo id (sử dụng id dùng cho UI)
  const handleDeleteBlogPostDetail = (detailId) => {
    setBlogPost((prev) => ({
      ...prev,
      blogDetails: prev.blogDetails.filter((detail) => detail.id !== detailId),
    }));
  };

  // Cập nhật nội dung của từng Blog Detail dựa trên key UI (title, description, image)
  const handleDetailChange = (detailId, field, value) => {
    setBlogPost((prev) => ({
      ...prev,
      blogDetails: prev.blogDetails.map((detail) =>
        detail.id === detailId ? { ...detail, [field]: value } : detail
      ),
    }));
  };

  // Xử lý tạo mới hoặc cập nhật blog
  const handleSubmit = async () => {
    try {
      // Xây dựng payload theo định dạng API yêu cầu:
      // API yêu cầu: blogTitle, blogImage, status, blogDetails: [ { blogDetailId, blogDetailTitle, description, blogDetailImage } ]
      const payload = {
        blogTitle: blogPost.blogTitle,
        blogImage: blogPost.blogImage,
        status: blogPost.status,
        blogDetails: blogPost.blogDetails.map((detail) => {
          // Dùng các giá trị trong UI để tạo payload
          const detailPayload = {
            blogDetailTitle: detail.title,
            description: detail.description,
            blogDetailImage: detail.image,
          };
          // Nếu mục đã có định danh từ backend, thêm vào payload để cập nhật
          if (detail.blogDetailId != null) {
            detailPayload.blogDetailId = detail.blogDetailId;
          }
          return detailPayload;
        }),
      };

      if (blogId) {
        await updateBlog(blogId, payload, token);
      } else {
        await createBlog(payload, token);
      }
      navigate("/admin/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {blogId ? "Edit Blog" : "Create Blog"}
      </Typography>

      {/* Form nhập Blog Title, Status và Image URL */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={9}>
          <TextField
            label="Blog Title"
            fullWidth
            value={blogPost.blogTitle}
            onChange={(e) => handleChange("blogTitle", e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Select
            value={blogPost.status ? "Active" : "Inactive"}
            onChange={(e) =>
              handleChange("status", e.target.value === "Active")
            }
            fullWidth
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Blog Image URL"
            fullWidth
            value={blogPost.blogImage}
            onChange={(e) => handleChange("blogImage", e.target.value)}
          />
        </Grid>
        {blogPost.blogImage && (
          <Grid item xs={12}>
            <img
              src={blogPost.blogImage}
              alt="Blog"
              style={{
                width: "20%",
                height: "auto",
                objectFit: "contain",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </Grid>
        )}
      </Grid>

      {/* Render danh sách Blog Details */}
      {blogPost.blogDetails.map((detail) => (
        <Box
          key={detail.id}
          border={1}
          padding={3}
          borderRadius={2}
          marginBottom={3}
          boxShadow={2}
        >
          <Grid container spacing={2}>
            <Grid item xs={9}>
              <TextField
                label="Detail Title"
                fullWidth
                value={detail.title} // Sử dụng field title
                onChange={(e) =>
                  handleDetailChange(detail.id, "title", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={3}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeleteBlogPostDetail(detail.id)}
                startIcon={<DeleteIcon />}
                fullWidth
              >
                Delete Detail
              </Button>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={detail.description}
                onChange={(e) =>
                  handleDetailChange(detail.id, "description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                fullWidth
                value={detail.image} // Sử dụng field image
                onChange={(e) =>
                  handleDetailChange(detail.id, "image", e.target.value)
                }
              />
            </Grid>
            {detail.image && (
              <Grid item xs={12}>
                <img
                  src={detail.image}
                  alt="Blog Detail"
                  style={{
                    width: "10%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      ))}

      {/* Nút Thêm Detail */}
      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          onClick={handleAddBlogPostDetail}
          startIcon={<AddIcon />}
          sx={{ marginRight: 2 }}
        >
          Add Detail
        </Button>
      </Box>

      {/* Nút Submit */}
      <Button variant="contained" color="secondary" onClick={handleSubmit}>
        {blogId ? "Update Blog" : "Create Blog"}
      </Button>
    </Box>
  );
};

export default CreateBlog;
