import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
  Button,
} from "@mui/material";
import { useStore } from "../../../store";
import { getAllVoucher } from "../../../store/voucher.api";
import { useNavigate } from "react-router-dom";
import "./Voucher.css";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const token = useStore((state) => state.profile.user?.token);
  const navigate = useNavigate();
  
  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const handleCreateNewVoucher = () => {
    navigate("/admin/createvoucher");
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await getAllVoucher(token);
        const voucherArray =
          response?.$values && Array.isArray(response.$values)
            ? response.$values
            : Array.isArray(response)
            ? response
            : [];
        setVouchers(voucherArray);
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, [token]);

  const sortedVouchers = [...vouchers].sort((a, b) => Number(a.voucherId) - Number(b.voucherId));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedVouchers.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedVouchers.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Định dạng ngày
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Điều hướng đến trang chi tiết voucher
  const handleRowClick = (voucherId) => {
    navigate(`/admin/voucher/${voucherId}`);
  };

  return (
    <Container maxWidth="lg" className="voucher-container">
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">Voucher List</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateNewVoucher}>
          Create New Voucher
        </Button>
      </Box>

      <TableContainer component={Paper} className="voucher-table-container">
        <Table className="voucher-table">
          <TableHead>
            <TableRow>
              <TableCell className="voucher-table-cell header-cell">Voucher ID</TableCell>
              <TableCell className="voucher-table-cell header-cell">Voucher Name</TableCell>
              <TableCell className="voucher-table-cell header-cell">Voucher Code</TableCell>
              <TableCell className="voucher-table-cell header-cell">Description</TableCell>
              <TableCell className="voucher-table-cell header-cell">Discount Amount</TableCell>
              <TableCell className="voucher-table-cell header-cell">Start Date</TableCell>
              <TableCell className="voucher-table-cell header-cell">End Date</TableCell>
              <TableCell className="voucher-table-cell header-cell">Status</TableCell>
              <TableCell className="voucher-table-cell header-cell">Minimum Purchase</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((voucher) => (
                <TableRow
                  key={voucher.voucherId}
                  hover
                  className="voucher-row"
                  onClick={() => handleRowClick(voucher.voucherId)} // ⬅️ Thêm sự kiện click
                  style={{ cursor: "pointer" }} // 👀 Biến con trỏ thành bàn tay khi hover
                >
                  <TableCell className="voucher-table-cell">{voucher.voucherId}</TableCell>
                  <TableCell className="voucher-table-cell">{voucher.voucherName}</TableCell>
                  <TableCell className="voucher-table-cell">{voucher.voucherCode}</TableCell>
                  <TableCell className="voucher-table-cell">{voucher.description}</TableCell>
                  <TableCell className="voucher-table-cell">{voucher.discountAmount}</TableCell>
                  <TableCell className="voucher-table-cell">
                    {voucher.startDate ? formatDate(voucher.startDate) : "N/A"}
                  </TableCell>
                  <TableCell className="voucher-table-cell">
                    {voucher.endDate ? formatDate(voucher.endDate) : "N/A"}
                  </TableCell>
                  <TableCell className="voucher-table-cell">
                    {voucher.status ? "Active" : "Inactive"}
                  </TableCell>
                  <TableCell className="voucher-table-cell">
                    {voucher.minimumPurchase ? voucher.minimumPurchase : "N/A"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No vouchers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box className="pagination-container">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
};

export default Voucher;
