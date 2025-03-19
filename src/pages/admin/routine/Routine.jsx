import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { getAllRoutines } from "../../../store/routine.api";
import "./Routine.css";

const Routine = () => {
  const [routines, setRoutines] = useState([]);
  //const token = useStore((state) => state.profile.user?.token);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const routineData = await getAllRoutines(token);
        // Kiểm tra dữ liệu trả về dạng { "$values": [...] }
        const routineArray =
          routineData?.$values && Array.isArray(routineData.$values)
            ? routineData.$values
            : Array.isArray(routineData)
            ? routineData
            : [];

        // Ánh xạ dữ liệu để hiển thị
        const mappedRoutines = routineArray.map((routine) => ({
          routineId: routine.routineId || "Unknown",
          routineName: routine.routineName || "Unknown",
          skinTypeName: routine.skinTypeName || "Unknown",
          status: routine.status ? "Active" : "Inactive",
        }));

        setRoutines(mappedRoutines);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  // Sắp xếp theo routineId tăng dần
  const sortedRoutines = [...routines].sort(
    (a, b) => Number(a.routineId) - Number(b.routineId)
  );

  // Phân trang dữ liệu
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
    <Container maxWidth="lg" className="routine-container">
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

      <TableContainer component={Paper} className="routine-table-container">
        <Table className="routine-table">
          <TableHead>
            <TableRow>
              <TableCell className="routine-cell header-cell">
                Routine ID
              </TableCell>
              <TableCell className="routine-cell header-cell">
                Routine Name
              </TableCell>
              <TableCell className="routine-cell header-cell">
                Skin Type
              </TableCell>
              <TableCell className="routine-cell header-cell">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((routine) => (
                <TableRow
                  key={routine.routineId}
                  hover
                  className="routine-row"
                  onClick={() => handleViewDetail(routine.routineId)}
                >
                  <TableCell className="routine-cell">
                    {routine.routineId}
                  </TableCell>
                  <TableCell className="routine-cell">
                    {routine.routineName}
                  </TableCell>
                  <TableCell className="routine-cell">
                    {routine.skinTypeName}
                  </TableCell>
                  <TableCell className="routine-cell">
                    {routine.status}
                  </TableCell>
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

export default Routine;
