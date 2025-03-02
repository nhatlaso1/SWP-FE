import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Pagination,
} from "@mui/material";
import { useStore } from "../../../store";
import { getAllRoutines } from "../../../store/routine.api";

const Routine = () => {
  const [routines, setRoutines] = useState([]);
  const token = useStore((state) => state.profile.user?.token);
  const navigate = useNavigate();

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const routineData = await getAllRoutines(token);

        console.log("Raw routine data:", routineData); // Kiểm tra dữ liệu từ API
        const routineArray =
          routineData?.$values && Array.isArray(routineData.$values)
            ? routineData.$values
            : Array.isArray(routineData)
            ? routineData
            : [];

        console.log("Parsed routine array:", routineArray);

        const mappedRoutines = routineArray.map((routine) => ({
          routineId: routine.routineId || "Unknown",
          routineName: routine.routineName || "Unknown",
          skinTypeName: routine.skinTypeName || "Unknown",
          status: routine.status ? "Active" : "Inactive",
        }));

        console.log("Mapped routines:", mappedRoutines);
        setRoutines(mappedRoutines);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  // Sắp xếp routines theo routineId tăng dần
  const sortedRoutines = [...routines].sort(
    (a, b) => Number(a.routineId) - Number(b.routineId)
  );

  // Tính toán phân trang
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = sortedRoutines.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(sortedRoutines.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleViewDetail = (routineId) => {
    navigate(`/admin/routine/${routineId}`);
  };

  const handleCreateNewRoutine = () => {
    navigate("/admin/createroutine");
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Typography variant="h4">Routine List</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateNewRoutine}
        >
          Create New Routine
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ minHeight: "500px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Routine ID</TableCell>
              <TableCell>Routine Name</TableCell>
              <TableCell>Skin Type</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((routine) => (
                <TableRow
                  key={routine.routineId}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleViewDetail(routine.routineId)}
                >
                  <TableCell>{routine.routineId}</TableCell>
                  <TableCell>{routine.routineName}</TableCell>
                  <TableCell>{routine.skinTypeName}</TableCell>
                  <TableCell>{routine.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No routines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" marginTop={2}>
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

export default Routine;
