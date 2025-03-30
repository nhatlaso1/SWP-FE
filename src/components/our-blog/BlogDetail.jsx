import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../../store/blog.api";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Divider,
  Box,
  CircularProgress,
  IconButton,
  Avatar,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";

export default function BlogDetail() {
  const { id } = useParams(); // Lấy ID từ URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (id) {
      getBlogById(id, token)
        .then((data) => {
          setBlog(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu blog:", error);
          setLoading(false);
        });
    }
  }, [id, token]);

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
    );
  if (!blog)
    return <Typography variant="h5">Bài viết không tồn tại</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Tiêu đề */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center", color: "#333" }}
      >
        {blog.blogTitle}
      </Typography>

      {/* Thông tin bài viết */}
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Grid item>
          <Avatar sx={{ bgcolor: "#3f51b5", width: 50, height: 50 }}>A</Avatar>
        </Grid>
        <Grid item>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Tác giả: Admin
          </Typography>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Ngày tạo: {new Date(blog.createdDate).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>

      {/* Ảnh đại diện bài viết */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="500"
          image={blog.blogImage}
          alt={blog.blogTitle}
          sx={{ borderRadius: "10px 10px 0 0" }}
        />
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            Giới thiệu
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {blog.blogDetails?.$values[0]?.description || "Không có mô tả"}
          </Typography>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Nội dung chi tiết */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        Nội dung chi tiết
      </Typography>

      {blog.blogDetails?.$values.map((detail, index) => (
        <Card key={index} sx={{ mb: 4, borderRadius: 3, boxShadow: 2, p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Hình ảnh bài viết */}
            {detail.blogDetailImage && (
              <Grid item xs={12} md={6}>
                <CardMedia
                  component="img"
                  height="300"
                  image={detail.blogDetailImage}
                  alt={detail.blogDetailTitle}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            )}
            {/* Nội dung bài viết */}
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                {detail.blogDetailTitle}
              </Typography>
              <Typography variant="body1">{detail.description}</Typography>
            </Grid>
          </Grid>
        </Card>
      ))}

      <Divider sx={{ my: 4 }} />

      {/* Chia sẻ bài viết */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Chia sẻ bài viết:</Typography>
        <IconButton>
          <ShareIcon />
        </IconButton>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Bình luận */}
    </Container>
  );
}
