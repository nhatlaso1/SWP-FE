import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import React from "react";
import { getAllBlogs } from "../../store/blog.api";

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
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function ListAllBlog() {
  const token = localStorage.getItem("token");
  const [blogs, setBlogs] = React.useState([]);

  React.useEffect(() => {
    getAllBlogs(token)
      .then((data) => setBlogs(data))
      .catch((error) => console.error("Error fetching blog from API:", error));
  }, []);
  return (
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
          {blogs.map((blogs) => (
            <StyledTableRow key={blogs.blogId}>
              <StyledTableCell component="th" scope="row">
                {blogs.blogId}
              </StyledTableCell>
              <StyledTableCell align="right">{blogs.blogTitle}</StyledTableCell>
              <StyledTableCell align="right">
                <img
                  src={blogs.blogImage}
                  alt={blogs.blogTitle}
                  style={{ width: "100px", height: "auto" }}
                />
              </StyledTableCell>
              <StyledTableCell align="right">
                {blogs.createdDate}
              </StyledTableCell>
              <StyledTableCell align="right">{blogs.status}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
