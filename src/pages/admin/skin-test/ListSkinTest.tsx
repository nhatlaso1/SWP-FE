import React, { useState, useEffect } from "react";
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
import { getAllSkinTests } from "../../../store/skinTest.api";
import { useStore } from "../../../store";

interface SkinTest {
  skinTestId: number;
  skinTestName: string;
  status: boolean;
}

const ListSkinTests: React.FC = () => {
  const navigate = useNavigate();
  const token = useStore((store) => store.profile.user?.token);

  const [skinTests, setSkinTests] = useState<SkinTest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSkinTests = async () => {
      if (!token) {
        console.error("Token không tồn tại!");
        return;
      }
    
      try {
        const skinTestsData = await getAllSkinTests(token); // Trả về SkinTest[]
        console.log("Dữ liệu trả về từ API:", skinTestsData); 
        const extractedData = skinTestsData.map((test: any) => ({
          skinTestId: test.skinTestId ?? 0,
          skinTestName: test.skinTestName ?? "Không có tên",
          status: test.status ?? false,
        }));
        setSkinTests(extractedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu bộ câu hỏi:", error);
      }
    };
    

    fetchSkinTests();
  }, [token]);

  const handleRowClick = (test: SkinTest) => {
    navigate(`/admin/skintest/${test.skinTestId}`);
  };

  const handleCreateNewTest = () => {
    navigate("/admin/createskintest");
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = skinTests.slice(startIndex, startIndex + itemsPerPage);

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
                  key={test.skinTestId} 
                  hover 
                  onClick={() => handleRowClick(test)} 
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{test.skinTestId}</TableCell>
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
          count={Math.ceil(skinTests.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default ListSkinTests;
