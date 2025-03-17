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
  Pagination,
} from "@mui/material";
import { getAllSkinTests } from "../../../store/skinTest.api";
import { useStore } from "../../../store";
import "./SkinTest.css";

const SkinTest = () => {
  const navigate = useNavigate();
  const token = useStore((store) => store.profile.user?.token);
  console.log("Token from store:", token);

  const [skinTests, setSkinTests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSkinTests = async () => {
      if (!token) {
        console.error("Token does not exist!");
        return;
      }

      try {
        const skinTestsData = await getAllSkinTests(token);
        console.log("API response data:", skinTestsData);

        // Giả sử API trả về dữ liệu dạng { "$values": [...] }
        const skinTestArray = skinTestsData?.$values ?? [];

        const extractedData = skinTestArray.map((test) => ({
          skinTestId: test.skinTestId ?? 0,
          skinTestName: test.skinTestName ?? "No Name",
          status: test.status ?? false,
        }));

        setSkinTests(extractedData);
      } catch (error) {
        console.error("Error fetching skin tests:", error);
      }
    };

    fetchSkinTests();
  }, [token]);

  const handleRowClick = (test) => {
    navigate(`/admin/skintest/${test.skinTestId}`);
  };

  const handleCreateNewTest = () => {
    navigate("/admin/createskintest");
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = skinTests.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container maxWidth="lg" className="skintest-container">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h4">Skin Test List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateNewTest}
        >
          Create New Skin Test
        </Button>
      </Box>

      <TableContainer component={Paper} className="skintest-table-container">
        <Table className="skintest-table">
          <TableHead>
            <TableRow>
              <TableCell className="skintest-cell header-cell">
                SkinTest ID
              </TableCell>
              <TableCell className="skintest-cell header-cell">
                Test Name
              </TableCell>
              <TableCell className="skintest-cell header-cell">
                Status
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((test) => (
                <TableRow
                  key={test.skinTestId}
                  hover
                  className="skintest-row"
                  onClick={() => handleRowClick(test)}
                >
                  <TableCell className="skintest-cell">
                    {test.skinTestId}
                  </TableCell>
                  <TableCell className="skintest-cell">
                    {test.skinTestName}
                  </TableCell>
                  <TableCell className="skintest-cell">
                    {test.status ? "Active" : "Inactive"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No skin tests available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className="pagination-container">
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

export default SkinTest;
