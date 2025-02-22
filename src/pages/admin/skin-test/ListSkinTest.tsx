import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Pagination 
} from "@mui/material";

interface SkinTest {
  id: number;
  skinTestName: string;
  status: boolean;
}

const mockSkinTests: SkinTest[] = [
  { id: 1, skinTestName: "Bộ câu hỏi Da dầu", status: true },
  { id: 2, skinTestName: "Bộ câu hỏi Da khô", status: false },
  { id: 3, skinTestName: "Bộ câu hỏi Da hỗn hợp", status: true },
  { id: 4, skinTestName: "Bộ câu hỏi Da nhạy cảm", status: false },
  { id: 5, skinTestName: "Bộ câu hỏi Da thường", status: true },
  { id: 6, skinTestName: "Bộ câu hỏi Da nhờn", status: true },
  { id: 7, skinTestName: "Bộ câu hỏi Da khô mẫn cảm", status: false },
  { id: 8, skinTestName: "Bộ câu hỏi Da nhạy cảm khô", status: true },
  { id: 9, skinTestName: "Bộ câu hỏi Da hỗn hợp thiên khô", status: false },
  { id: 10, skinTestName: "Bộ câu hỏi Da hỗn hợp thiên dầu", status: true },
  { id: 11, skinTestName: "Bộ câu hỏi Da mất nước", status: true },
  { id: 12, skinTestName: "Bộ câu hỏi Da dầu mụn", status: false },
  { id: 13, skinTestName: "Bộ câu hỏi Da khô mịn", status: true },
  { id: 14, skinTestName: "Bộ câu hỏi Da nhạy cảm dễ kích ứng", status: true },
  { id: 15, skinTestName: "Bộ câu hỏi Da hỗn hợp không đều màu", status: false }
];

const ListSkinTests: React.FC = () => {
  const navigate = useNavigate();
  
  // Trạng thái phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleRowClick = (test: SkinTest) => {
    navigate(`/admin/skintest/${test.id}`);  // Điều hướng tới chi tiết bộ câu hỏi
  };

  const handleCreateNewTest = () => {
    navigate("/admin/skintest");
  };

  // Tính toán dữ liệu hiển thị cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = mockSkinTests.slice(startIndex, startIndex + itemsPerPage);

  // Thay đổi trang khi người dùng thay đổi phân trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">Danh sách bộ câu hỏi</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateNewTest}>
          Tạo bộ câu hỏi mới
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ minHeight: "500px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên bộ câu hỏi</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((test) => (
                <TableRow 
                  key={test.id} 
                  hover 
                  onClick={() => handleRowClick(test)} 
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{test.id}</TableCell>
                  <TableCell>{test.skinTestName}</TableCell>
                  <TableCell>{test.status ? "Hoạt động" : "Không hoạt động"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={Math.ceil(mockSkinTests.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default ListSkinTests;
