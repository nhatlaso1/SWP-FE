import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Box,
  Grid,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllBlogs } from "../../../store/blog.api";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ListAllBlog() {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const handleCreateNewBlog = () => {
    navigate("/staff/createBlog");
  };

  useEffect(() => {
    getAllBlogs(token)
      .then((data) => {
        // Nếu API trả về { data: [...] } hãy thay đổi thành data.data
        console.log("Data từ API:", data);
        setBlogs(data);
      })
      .catch((error) => console.error("Error fetching blog from API:", error));
  }, [token]);

  const handleRowClick = (blogId) => {
    navigate(`/staff/blogs/${blogId}`);
  };

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h4">Blog List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateNewBlog}
        >
          Create New Blog
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Blog Id</StyledTableCell>
              <StyledTableCell align="right">Blog Title</StyledTableCell>
              <StyledTableCell align="right">Blog Image</StyledTableCell>
              <StyledTableCell align="right">Created Date</StyledTableCell>
              <StyledTableCell align="right">Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <StyledTableRow
                key={blog.blogId}
                hover
                onClick={() => handleRowClick(blog.blogId)}
                style={{ cursor: "pointer" }}
              >
                <StyledTableCell component="th" scope="row">
                  {blog.blogId}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {blog.blogTitle}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <img
                    src={blog.blogImage}
                    alt={blog.blogTitle}
                    style={{ width: "50px", height: "50px" }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right">
                  {blog.createdDate}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {blog.status ? "Active" : "Inactive"}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
