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
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
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

      <TableContainer component={Paper} sx={{ minHeight: "500px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SkinTest ID</TableCell>
              <TableCell>Test Name</TableCell>
              <TableCell>Status</TableCell>
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
                  <TableCell>{test.status ? "Active" : "Inactive"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No Data
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

export default SkinTest;
