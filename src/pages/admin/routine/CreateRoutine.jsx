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

const CreateRoutine = () => {
  const [routines, setRoutines] = useState([]);
  const token = useStore((state) => state.profile.user?.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await getAllRoutines(token);
        // Nếu data có thuộc tính $values, sử dụng nó; nếu data là mảng thì dùng luôn; nếu không có thì mảng rỗng.
        const routineArray = data.$values
          ? data.$values
          : Array.isArray(data)
          ? data
          : [];
        setRoutines(routineArray);
      } catch (error) {
        console.error("Error fetching routines:", error);
      }
    };

    fetchRoutines();
  }, [token]);

  const handleViewDetail = (routineId) => {
    navigate(`/admin/routines/${routineId}`);
  };

  const handleCreateNewRoutine = () => {
    navigate("/admin/routines/create");
  };

  return (
    <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={2}>
        <Typography variant="h4">Routine List</Typography>
        <Button variant="contained" color="primary" onClick={handleCreateNewRoutine}>
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

export default CreateRoutine;
