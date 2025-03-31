import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogById } from "../../store/blog.api";
import {
  Container,
  Typography,
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Tiêu đề blog */}
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#333",
        }}
      >
        {blog.blogTitle}
      </Typography>

      {/* Ảnh blog full width */}
      <Box sx={{ width: "100%", mt: 2 }}>
        <Box
          component="img"
          src={blog.blogImage}
          alt={blog.blogTitle}
          sx={{
            width: "100%",
            height: "300px",
            objectFit: "cover",
            borderRadius: 2,
          }}
        />
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Nội dung blog chi tiết */}
      {blog.blogDetails?.$values.map((detail, index) => {
        // Xác định vị trí dựa trên chỉ số: nếu số chẵn, text bên trái, image bên phải; nếu lẻ thì đảo ngược.
        const isEven = index % 2 === 0;
        return (
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ mb: 4 }}
            key={index}
          >
            {isEven ? (
              <>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    {detail.blogDetailTitle}
                  </Typography>
                  <Typography variant="body1">{detail.description}</Typography>
                </Grid>
                {detail.blogDetailImage && (
                  <Grid item xs={12} md={6}>
                    <Box
                      component="img"
                      src={detail.blogDetailImage}
                      alt={detail.blogDetailTitle}
                      sx={{
                        width: "100%",
                        height: "400px",
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                  </Grid>
                )}
              </>
            ) : (
              <>
                {detail.blogDetailImage && (
                  <Grid item xs={12} md={6}>
                    <Box
                      component="img"
                      src={detail.blogDetailImage}
                      alt={detail.blogDetailTitle}
                      sx={{
                        width: "100%",
                        height: "400px",
                        borderRadius: 2,
                        objectFit: "cover",
                      }}
                    />
                  </Grid>
                )}
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
                    {detail.blogDetailTitle}
                  </Typography>
                  <Typography variant="body1">{detail.description}</Typography>
                </Grid>
              </>
            )}
          </Grid>
        );
      })}

      <Divider sx={{ my: 4 }} />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <Grid item>
          <Typography variant="body2" sx={{ color: "gray" }}>
            Create date: {new Date(blog.createdDate).toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
