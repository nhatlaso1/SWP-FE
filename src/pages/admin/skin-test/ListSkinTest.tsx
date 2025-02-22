import React from "react";
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
  { id: 2, skinTestName: "Bộ câu hỏi Da khô", status: false }
];

const ListSkinTests: React.FC = () => {
  const navigate = useNavigate();

  const handleRowClick = (test: SkinTest) => {
    console.log("Chi tiết bộ câu hỏi:", test);
  };

  const handleCreateNewTest = () => {
    navigate("/admin/skintest");
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
            {mockSkinTests.length > 0 ? (
              mockSkinTests.map((test) => (
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
            {[...Array(10 - mockSkinTests.length)].map((_, index) => (
              <TableRow key={index} style={{ height: 53 }}>
                <TableCell colSpan={3}></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination count={2} color="primary" />
      </Box>
    </Container>
  );
};

export default ListSkinTests;
