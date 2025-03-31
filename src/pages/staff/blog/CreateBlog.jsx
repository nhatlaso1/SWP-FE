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
} from "../../../store/blog.api";

const CreateBlog = () => {
  const navigate = useNavigate();
  const { blogId } = useParams(); // Get blogId from URL if available
  const token = localStorage.getItem("token");

  // Initialize state with blog data structure
  const [blogPost, setBlogPost] = useState({
    blogTitle: "",
    blogImage: "",
    status: true,
    blogDetails: [],
  });

  // State for form errors
  const [errors, setErrors] = useState({
    blogTitle: "",
    blogImage: "",
    blogDetails: {},
  });

  // If blogId exists, fetch blog data to edit
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

  // General change handler for blog fields
  const handleChange = (field, value) => {
    setBlogPost((prev) => ({ ...prev, [field]: value }));
  };

  // Add a new Blog Detail
  const handleAddBlogPostDetail = () => {
    setBlogPost((prev) => ({
      ...prev,
      blogDetails: [
        ...prev.blogDetails,
        {
          id: Date.now(), // Used for React key
          blogDetailId: null, // Not yet created on backend
          title: "",
          description: "",
          image: "",
        },
      ],
    }));
  };

  // Delete Blog Detail by UI id
  const handleDeleteBlogPostDetail = (detailId) => {
    setBlogPost((prev) => ({
      ...prev,
      blogDetails: prev.blogDetails.filter((detail) => detail.id !== detailId),
    }));
    // Also remove error for that detail if exists
    setErrors((prev) => {
      const newDetailErrors = { ...prev.blogDetails };
      delete newDetailErrors[detailId];
      return { ...prev, blogDetails: newDetailErrors };
    });
  };

  // Update individual Blog Detail based on UI key (title, description, image)
  const handleDetailChange = (detailId, field, value) => {
    setBlogPost((prev) => ({
      ...prev,
      blogDetails: prev.blogDetails.map((detail) =>
        detail.id === detailId ? { ...detail, [field]: value } : detail
      ),
    }));
    // Clear error for the field just changed
    setErrors((prev) => ({
      ...prev,
      blogDetails: {
        ...prev.blogDetails,
        [detailId]: { ...prev.blogDetails[detailId], [field]: "" },
      },
    }));
  };

  // Check if an image exists by creating a new Image object
  const checkImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(new Error("Image load error"));
      img.src = url;
    });
  };

  // Validate form fields before submitting
  const validateForm = async () => {
    let valid = true;
    let newErrors = {
      blogTitle: "",
      blogImage: "",
      blogDetails: {},
    };

    // Validate blogTitle
    if (!blogPost.blogTitle.trim()) {
      newErrors.blogTitle = "Blog title cannot be empty";
      valid = false;
    }

    // Validate blogImage
    if (!blogPost.blogImage.trim()) {
      newErrors.blogImage = "Blog image URL cannot be empty";
      valid = false;
    } else {
      try {
        await checkImage(blogPost.blogImage);
      } catch (error) {
        newErrors.blogImage = "Blog image does not exist or is invalid";
        valid = false;
      }
    }

    // Validate each blogDetail
    for (const detail of blogPost.blogDetails) {
      let detailErrors = {};
      if (!detail.title.trim()) {
        detailErrors.title = "Detail title cannot be empty";
        valid = false;
      }
      if (!detail.description.trim()) {
        detailErrors.description = "Description cannot be empty";
        valid = false;
      }
      if (!detail.image.trim()) {
        detailErrors.image = "Image URL cannot be empty";
        valid = false;
      } else {
        try {
          await checkImage(detail.image);
        } catch (error) {
          detailErrors.image = "Detail image does not exist or is invalid";
          valid = false;
        }
      }
      if (Object.keys(detailErrors).length > 0) {
        newErrors.blogDetails[detail.id] = detailErrors;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  // Handle create or update blog
  const handleSubmit = async () => {
    const isValid = await validateForm();
    if (!isValid) {
      // If form is not valid, notify user to check the fields
      console.log("Form errors exist. Please check the fields.");
      return;
    }

    try {
      // Build payload as required by the API:
      // API requires: blogTitle, blogImage, status, blogDetails: [ { blogDetailId, blogDetailTitle, description, blogDetailImage } ]
      const payload = {
        blogTitle: blogPost.blogTitle,
        blogImage: blogPost.blogImage,
        status: blogPost.status,
        blogDetails: blogPost.blogDetails.map((detail) => {
          const detailPayload = {
            blogDetailTitle: detail.title,
            description: detail.description,
            blogDetailImage: detail.image,
          };
          // If detail has an id from the backend, include it in the payload
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
      navigate("/staff/blogs");
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {blogId ? "Edit Blog" : "Create Blog"}
      </Typography>

      {/* Form for Blog Title, Status, and Image URL */}
      <Grid container spacing={2} sx={{ marginBottom: 2 }}>
        <Grid item xs={9}>
          <TextField
            label="Blog Title"
            fullWidth
            value={blogPost.blogTitle}
            onChange={(e) => handleChange("blogTitle", e.target.value)}
            error={!!errors.blogTitle}
            helperText={errors.blogTitle}
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
            error={!!errors.blogImage}
            helperText={errors.blogImage}
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

      {/* Render list of Blog Details */}
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
                value={detail.title}
                onChange={(e) =>
                  handleDetailChange(detail.id, "title", e.target.value)
                }
                error={
                  errors.blogDetails[detail.id] &&
                  !!errors.blogDetails[detail.id].title
                }
                helperText={
                  errors.blogDetails[detail.id] &&
                  errors.blogDetails[detail.id].title
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
                error={
                  errors.blogDetails[detail.id] &&
                  !!errors.blogDetails[detail.id].description
                }
                helperText={
                  errors.blogDetails[detail.id] &&
                  errors.blogDetails[detail.id].description
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                fullWidth
                value={detail.image}
                onChange={(e) =>
                  handleDetailChange(detail.id, "image", e.target.value)
                }
                error={
                  errors.blogDetails[detail.id] &&
                  !!errors.blogDetails[detail.id].image
                }
                helperText={
                  errors.blogDetails[detail.id] &&
                  errors.blogDetails[detail.id].image
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

      {/* Button to add a new Detail */}
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

      {/* Submit Button */}
      <Button variant="contained" color="secondary" onClick={handleSubmit}>
        {blogId ? "Update Blog" : "Create Blog"}
      </Button>
    </Box>
  );
};

export default CreateBlog;
