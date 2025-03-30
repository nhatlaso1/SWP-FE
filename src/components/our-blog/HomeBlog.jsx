import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { getAllBlogs } from "../../store/blog.api";
import { useNavigate } from "react-router-dom";

// Tạo component Paper có style
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

export default function HomeBlog() {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  const handleViewDetail = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  const handleSeeMore = () => {
    navigate("/blogs");
  };

  // Gọi API khi component được mount
  React.useEffect(() => {
    getAllBlogs(token)
      .then((data) => {
        console.log("Fetched Blogs:", data); // Debug dữ liệu blogs
        setBlogs(data);
      })
      .catch((error) => console.error("Error fetching blog from API:", error))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h2 className="title">Our Blog</h2>
    <Box sx={{ flexGrow: 1, p: 2, textAlign: "center" }}>
      {loading ? (
        <Typography textAlign="center">Đang tải danh sách blog...</Typography>
      ) : blogs.length === 0 ? (
        <Typography textAlign="center">Không có bài viết nào.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {blogs.slice(0, 4).map((blog) => (
              <Grid
                item
                xs={3} // Mỗi blog chiếm 3 cột để 4 blog có thể nằm trên cùng 1 hàng
                sm={3}
                md={3}
                key={blog.blogId}
                onClick={() => handleViewDetail(blog.blogId)}
              >
                <Card sx={{ maxWidth: 345, mx: "auto" }}>
                  <CardMedia
                    component="img"
                    height="250"
                    image={blog.blogImage || "https://via.placeholder.com/140"}
                    alt={blog.blogTitle}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {blog.blogTitle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(blog.createdDate).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Nút See More */}
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSeeMore}>
              See More
            </Button>
          </Box>
        </>
      )}
    </Box>
    </div>
  );
}
