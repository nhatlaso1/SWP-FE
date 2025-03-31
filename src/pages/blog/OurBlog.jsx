import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
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

export default function OurBlog() {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = React.useState([]);
  const [activeBlogs, setActiveBlogs] = React.useState([]); // Danh sách blog có status Active
  const [loading, setLoading] = React.useState(true);

  const navigate = useNavigate();

  const handleViewDetail = (blogId) => {
    navigate(`/blogs/${blogId}`);
  };

  // Gọi API khi component được mount
  React.useEffect(() => {
    getAllBlogs(token)
      .then((data) => {
        console.log("Fetched Blogs:", data); // Debug dữ liệu blogs
        setBlogs(data);
        
        // Lọc danh sách blog có status Active
        const activeBlogsData = data.filter(blog => blog.status === true);
        setActiveBlogs(activeBlogsData);
      })
      .catch((error) => console.error("Error fetching blog from API:", error))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      {loading ? (
        <Typography textAlign="center">Loading...</Typography>
      ) : activeBlogs.length === 0 ? (
        <Typography textAlign="center">No Blog.</Typography>
      ) : (
        <Grid container spacing={3}>
          {activeBlogs.map((blog) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={blog.blogId}
              hover
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
      )}
    </Box>
  );
}
