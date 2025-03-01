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
} from "@mui/material";
import { useStore } from "../../../store";
import { getAllRoutines } from "../../../store/routine.api";

const Routine = () => {
  const [routines, setRoutines] = useState([]);
  const token = useStore((state) => state.profile.user?.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await getAllRoutines(token);
        console.log("Data from API:", data);
        // Nếu data có thuộc tính $values, lấy mảng từ đó; nếu không thì ép thành mảng (hoặc rỗng)
        const routineArray =
          data && data.$values ? data.$values : Array.isArray(data) ? data : [];
        // In log từng object để kiểm tra xem có các trường routineId, routineName, skinTypeName không
        routineArray.forEach((routine, index) => {
          console.log(`Routine ${index + 1}:`, JSON.stringify(routine));
        });
        // Ép kiểu đối tượng theo mẫu mà bạn cần
        const mappedRoutines = routineArray.map((routine) => ({
          routineId: routine.routineId, // Kiểm tra xem API có trả về routineId hay không
          routineName: routine.routineName,
          skinTypeName: routine.skinTypeName, // Kiểm tra xem API có trả về skinTypeName hay không
        }));
        setRoutines(mappedRoutines);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
  }, [token]);

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
            </TableRow>
          </TableHead>
          <TableBody>
            {routines.length > 0 ? (
              routines.map((routine) => (
                <TableRow
                  key={routine.routineId}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleViewDetail(routine.routineId)}
                >
                  <TableCell>{routine.routineId}</TableCell>
                  <TableCell>{routine.routineName}</TableCell>
                  <TableCell>{routine.skinTypeName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No routines found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Routine;
