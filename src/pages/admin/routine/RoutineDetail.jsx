import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStore } from "../../../store";
import { getRoutineById, updateRoutine } from "../../../store/routine.api";

const RoutineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useStore((state) => state.profile.user?.token);

  // Nếu có id => xem chi tiết và cập nhật; nếu không có thì chuyển về trang danh sách
  const [isEditing, setIsEditing] = useState(false);
  const [routine, setRoutine] = useState({
    routineId: 0,
    routineName: "",
    skinTypeId: 0,
    routineDetails: [],
  });

  useEffect(() => {
    if (id) {
      fetchRoutine(Number(id));
    }
  }, [id]);

  const fetchRoutine = async (routineId) => {
    try {
      const data = await getRoutineById(routineId, token);
      if (data) {
        setRoutine(data);
      }
    } catch (error) {
      console.error("Error fetching routine:", error);
    }
  };

  // Thêm Routine Detail
  const handleAddDetail = () => {
    setRoutine((prev) => ({
      ...prev,
      routineDetails: [
        ...prev.routineDetails,
        { routineDetailName: "", routineSteps: [] },
      ],
    }));
  };

  // Xóa Routine Detail
  const handleDeleteDetail = (index) => {
    setRoutine((prev) => ({
      ...prev,
      routineDetails: prev.routineDetails.filter((_, idx) => idx !== index),
    }));
  };

  // Thêm Routine Step vào Routine Detail tại indexDetail
  const handleAddStep = (indexDetail) => {
    setRoutine((prev) => {
      const details = prev.routineDetails.map((detail, idx) => {
        if (idx === indexDetail) {
          return {
            ...detail,
            routineSteps: [
              ...detail.routineSteps,
              {
                step: detail.routineSteps.length + 1,
                instruction: "",
                categoryId: 0,
              },
            ],
          };
        }
        return detail;
      });
      return { ...prev, routineDetails: details };
    });
  };

  // Xóa Routine Step từ Routine Detail tại indexDetail
  const handleDeleteStep = (indexDetail, stepIndex) => {
    setRoutine((prev) => {
      const details = prev.routineDetails.map((detail, idx) => {
        if (idx === indexDetail) {
          return {
            ...detail,
            routineSteps: detail.routineSteps.filter((_, sIdx) => sIdx !== stepIndex),
          };
        }
        return detail;
      });
      return { ...prev, routineDetails: details };
    });
  };

  // Cập nhật giá trị cho Routine
  const handleChange = (field, value) => {
    setRoutine((prev) => ({ ...prev, [field]: value }));
  };

  // Cập nhật Routine Detail
  const handleDetailChange = (index, value, field) => {
    setRoutine((prev) => {
      const details = prev.routineDetails.map((detail, idx) =>
        idx === index ? { ...detail, [field]: value } : detail
      );
      return { ...prev, routineDetails: details };
    });
  };

  // Cập nhật Routine Step
  const handleStepChange = (indexDetail, stepIndex, value, field) => {
    setRoutine((prev) => {
      const details = prev.routineDetails.map((detail, idx) => {
        if (idx === indexDetail) {
          const updatedSteps = detail.routineSteps.map((step, sIdx) =>
            sIdx === stepIndex ? { ...step, [field]: value } : step
          );
          return { ...detail, routineSteps: updatedSteps };
        }
        return detail;
      });
      return { ...prev, routineDetails: details };
    });
  };

  const handleSubmit = async () => {
    try {
      await updateRoutine(routine, token);
      navigate("/admin/routines");
    } catch (error) {
      console.error("Error updating routine:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Routine Detail
      </Typography>
      <Button variant="outlined" onClick={() => setIsEditing(!isEditing)} sx={{ mb: 2 }}>
        {isEditing ? "View Mode" : "Edit Mode"}
      </Button>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Routine Name"
          fullWidth
          value={routine.routineName}
          onChange={(e) => handleChange("routineName", e.target.value)}
          disabled={!isEditing}
        />
      </Box>

      {routine.routineDetails.map((detail, dIdx) => (
        <Card key={dIdx} sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={10}>
                <TextField
                  label="Routine Detail Name"
                  fullWidth
                  value={detail.routineDetailName}
                  onChange={(e) =>
                    handleDetailChange(dIdx, e.target.value, "routineDetailName")
                  }
                  disabled={!isEditing}
                />
              </Grid>
              {isEditing && (
                <Grid item xs={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleDeleteDetail(dIdx)}
                  >
                    Delete Detail
                  </Button>
                </Grid>
              )}
            </Grid>

            {detail.routineSteps.map((step, sIdx) => (
              <Box key={sIdx} sx={{ mt: 2, ml: 2, p: 2, border: "1px solid #ccc", borderRadius: 1 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <TextField
                      label="Step"
                      fullWidth
                      value={step.step}
                      onChange={(e) =>
                        handleStepChange(dIdx, sIdx, Number(e.target.value), "step")
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={7}>
                    <TextField
                      label="Instruction"
                      fullWidth
                      multiline
                      value={step.instruction}
                      onChange={(e) =>
                        handleStepChange(dIdx, sIdx, e.target.value, "instruction")
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <TextField
                      label="Category ID"
                      fullWidth
                      value={step.categoryId}
                      onChange={(e) =>
                        handleStepChange(dIdx, sIdx, Number(e.target.value), "categoryId")
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  {isEditing && (
                    <Grid item xs={1}>
                      <IconButton onClick={() => handleDeleteStep(dIdx, sIdx)}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Box>
            ))}

            {isEditing && (
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => handleAddStep(dIdx)}
                sx={{ mt: 2 }}
              >
                Add Step
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {isEditing && (
        <Button variant="contained" onClick={handleAddDetail} sx={{ mb: 2 }}>
          Add Routine Detail
        </Button>
      )}

      {isEditing && (
        <Box>
          <Button variant="contained" color="secondary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RoutineDetail;
