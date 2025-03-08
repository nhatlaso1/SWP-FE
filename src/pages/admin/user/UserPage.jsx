import * as React from "react";
import PropTypes from "prop-types";
import { useTheme, styled } from "@mui/material/styles";
import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Button,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import "./UserPage.css";

// Styled components cho TableCell và TableRow
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: 14,
  padding: "6px 8px",
  border: "1px solid #ccc",
  [`&.${TableCell.head}`]: {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.common.white,
    fontWeight: "bold",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    cursor: "pointer",
  },
}));

// Custom pagination actions
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

// Hàm tạo dữ liệu mẫu cho 60 người dùng với các trường: IdUser, Name, PhoneNumber, DateOfJoining, confirmed_email, skinType
const skinTypeMap = {
  1: "Oily skin",
  2: "Combination skin",
  3: "Sensitive skin",
  4: "Normal skin",
  5: "Dry skin",
};

const generateUsers = () => {
  const firstNames = [
    "Alice",
    "Bob",
    "Charlie",
    "David",
    "Eva",
    "Frank",
    "Grace",
    "Helen",
    "Ian",
    "Julia",
  ];
  const lastNames = [
    "Nguyen",
    "Tran",
    "Le",
    "Pham",
    "Hoang",
    "Duong",
    "Phan",
    "Vu",
    "Bui",
    "Dang",
  ];
  const users = [];
  for (let i = 1; i <= 60; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const fullName = `${firstName} ${lastName} ${i}`;
    const phoneNumber = "0" + (380000000 + i);
    const dateOfJoining = new Date(
      2023,
      i % 12,
      (i % 28) + 1
    ).toLocaleDateString();
    // Xét confirmed_email: "Yes" nếu i chẵn, "No" nếu lẻ
    const confirmed_email = i % 2 === 0 ? "Yes" : "No";
    // Skin type: dùng (i % 5) + 1
    const skinTypeId = (i % 5) + 1;
    users.push({
      IdUser: i,
      Name: fullName,
      PhoneNumber: phoneNumber,
      DateOfJoining: dateOfJoining,
      confirmed_email: confirmed_email,
      skinType: skinTypeMap[skinTypeId],
    });
  }
  return users;
};

const rows = generateUsers();

export default function UserPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const navigate = useNavigate();

  // Tính số dòng trống (nếu có) để tránh layout jump
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDetail = (id) => {
    navigate(`/admin/user/${id}`);
  };

  return (
    <Container maxWidth="lg" className="userpage-container">
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <TableContainer component={Paper} className="userpage-table-container">
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: "8%" }}>Id User</StyledTableCell>
              <StyledTableCell sx={{ width: "20%" }}>Name</StyledTableCell>
              <StyledTableCell sx={{ width: "20%" }} align="right">
                Phone Number
              </StyledTableCell>
              <StyledTableCell sx={{ width: "20%" }} align="right">
                Date Of Joining
              </StyledTableCell>
              <StyledTableCell sx={{ width: "12%" }} align="right">
                Confirmed Email
              </StyledTableCell>
              <StyledTableCell sx={{ width: "20%" }} align="center">
                Skin Type
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : rows
            ).map((row) => (
              <StyledTableRow
                key={row.IdUser}
                onClick={() => handleDetail(row.IdUser)}
              >
                <StyledTableCell component="th" scope="row">
                  {row.IdUser}
                </StyledTableCell>
                <StyledTableCell>{row.Name}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.PhoneNumber}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.DateOfJoining}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.confirmed_email}
                </StyledTableCell>
                <StyledTableCell align="center">{row.skinType}</StyledTableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={6}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Container>
  );
}
