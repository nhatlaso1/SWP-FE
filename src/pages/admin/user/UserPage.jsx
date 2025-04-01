import React from "react";
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
  TablePagination,
  TableCell as MuiTableCell,
  TableRow as MuiTableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import "./UserPage.css";
import { getAllCustomer,activeAccount, deActiveAccount } from "../../../store/user.api";

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

export default function UserPage() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [customers, setCustomers] = React.useState([]);
 
  const token = localStorage.getItem("token");

  // Gọi API lấy danh sách khách hàng khi component mount
  React.useEffect(() => {
    getAllCustomer(token)
      .then((data) => setCustomers(data))
      .catch((error) =>
        console.error("Error fetching customers from API:", error)
      );
  }, []);

  // Tính số dòng trống (nếu có) để tránh layout jump
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - customers.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleActive = (userId) => {
    console.log("userId",userId)
    activeAccount(token, userId)
      .then(() => {
        // Cập nhật lại danh sách khách hàng sau khi kích hoạt tài khoản
        getAllCustomer(token)
          .then((data) => setCustomers(data))
          .catch((error) =>
            console.error("Error fetching customers from API:", error)
          );
      })
      .catch((error) => {
        console.error("Error activating account:", error);
      });
  }
  const handleDeActive = (userId) => {
    console.log("userId",userId)
    deActiveAccount(token, userId)
      .then(() => {
        // Cập nhật lại danh sách khách hàng sau khi kích hoạt tài khoản
        getAllCustomer(token)
          .then((data) => setCustomers(data))
          .catch((error) =>
            console.error("Error fetching customers from API:", error)
          );
      })
      .catch((error) => {
        console.error("Error activating account:", error);
      });
  }


  return (
    <Container maxWidth="lg" className="userpage-container">
      <Typography variant="h4" gutterBottom>
        User List
      </Typography>
      <TableContainer component={Paper} className="userpage-table-container">
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: "8%" }}>
                Customer Id
              </StyledTableCell>
              <StyledTableCell sx={{ width: "13%" }}>
                Full Name
              </StyledTableCell>
              <StyledTableCell sx={{ width: "13%" }} align="right">
                Phone Number
              </StyledTableCell>
              <StyledTableCell sx={{ width: "13%" }} align="right">
                Email
              </StyledTableCell>
              <StyledTableCell sx={{ width: "13%" }} align="right">
                Birthday
              </StyledTableCell>
              <StyledTableCell sx={{ width: "13%" }} align="center">
                Skin Type
              </StyledTableCell>
              <StyledTableCell sx={{ width: "13%" }} align="center">
                Status
              </StyledTableCell>
              <StyledTableCell sx={{ width: "13%" }} align="center">
                
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : customers
            ).map((row) => (
              <StyledTableRow
                key={row.customerId}  
              >
                <StyledTableCell component="th" scope="row">
                  {row.customerId}
                </StyledTableCell>
                <StyledTableCell>{row.fullName}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.phoneNumber}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.email}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.birthday}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.skinType ? row.skinType.skinTypeName : "-"}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.status ? "Active" : "Inactive"}
                </StyledTableCell>
                <StyledTableCell align="center">
                <div className="header-actions">
                  {row.status ? 
                  <button onClick={() => { handleDeActive(row.customerId)  }}>
                    Inactive
                  </button> : <button onClick={() => { handleActive(row.customerId)  }}>
                    Active
                  </button>}

                  
                </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <MuiTableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={7}
                count={customers.length}
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
