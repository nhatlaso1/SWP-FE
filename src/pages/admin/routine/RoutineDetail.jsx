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
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStore } from "../../../store";
import {
  getCategories,
  getRoutineById,
  updateRoutine,
} from "../../../store/routine.api";
import { getAllSkinType } from "../../../store/skintype.api";
const RoutineDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useStore((state) => state.profile.user?.token);
  const [skinTypes, setSkinTypes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [routine, setRoutine] = useState({
    routineId: 0,
    routineName: "",
    skinTypeId: 0,
    routineDetails: [],
  });
  const [categories, setCategories] = useState([]);

  // Load Routine theo id khi component mount hoặc id thay đổi
  useEffect(() => {
    if (id) {
      fetchRoutine(Number(id));
    }
  }, [id]);
  useEffect(() => {
    const loadSkinTypes = async () => {
      try {
        const skinTypeList = await getAllSkinType();
        setSkinTypes(skinTypeList);
      } catch (error) {
        console.error("Error loading skin types:", error);
      }
    };

    loadSkinTypes();
  }, []);
  const fetchRoutine = async () => {
    try {
      const routineId = Number(id); // Lấy id từ URL
      const data = await getRoutineById(routineId, token);
      if (data) {
        setRoutine({
          routineId: routineId, // Luôn lấy routineId từ URL
          routineName: data.routineName || "",
          skinTypeId: data.skinTypeId || 0,
          skinTypeName: data.skinTypeName || "",
          routineDetails: data.routineDetails || [],
        });
      }
    } catch (error) {
      console.error("Error fetching routine:", error);
    }
  };

  // Load danh sách Category từ API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryList = await getCategories();
        setCategories(categoryList);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  // Thêm Routine Detail mới
  const handleAddDetail = () => {
    setRoutine((prev) => ({
      ...prev,
      routineDetails: [
        ...prev.routineDetails,
        { routineDetailName: "", routineSteps: [] },
      ],
    }));
  };

  // Xóa Routine Detail tại vị trí index
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

  // Xóa Routine Step tại indexDetail và stepIndex
  const handleDeleteStep = (indexDetail, stepIndex) => {
    setRoutine((prev) => {
      const details = prev.routineDetails.map((detail, idx) => {
        if (idx === indexDetail) {
          return {
            ...detail,
            routineSteps: detail.routineSteps.filter(
              (_, sIdx) => sIdx !== stepIndex
            ),
          };
        }
        return detail;
      });
      return { ...prev, routineDetails: details };
    });
  };

  // Cập nhật giá trị cho Routine (ví dụ: routineName)
  const handleChange = (field, value) => {
    setRoutine((prev) => ({ ...prev, [field]: value }));
  };

  // Cập nhật giá trị cho Routine Detail tại index
  const handleDetailChange = (index, value, field) => {
    setRoutine((prev) => {
      const details = prev.routineDetails.map((detail, idx) =>
        idx === index ? { ...detail, [field]: value } : detail
      );
      return { ...prev, routineDetails: details };
    });
  };

  // Cập nhật giá trị cho Routine Step tại indexDetail, stepIndex
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

  // Gửi dữ liệu cập nhật về API
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
      <Button
        variant="outlined"
        onClick={() => setIsEditing((prev) => !prev)}
        sx={{ mb: 2 }}
      >
        {isEditing ? "View Mode" : "Edit Mode"}
      </Button>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={8}>
          <TextField
            label="Routine Name"
            fullWidth
            value={routine.routineName}
            onChange={(e) => handleChange("routineName", e.target.value)}
            disabled={!isEditing}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
            <InputLabel>Skin Type</InputLabel>
            <Select
              value={routine.skinTypeId}
              onChange={(e) => handleChange("skinTypeId", e.target.value)}
              disabled={!isEditing}
              label="Skin Type"
            >
              {skinTypes.map((skinType) => (
                <MenuItem key={skinType.skinTypeId} value={skinType.skinTypeId}>
                  {skinType.skinTypeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {routine.routineDetails.map((detail, dIdx) => (
        <Card key={dIdx} sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={10}>
                <FormControl fullWidth>
                  <InputLabel>Routine Detail Name</InputLabel>
                  <Select
                    label="Routine Detail Name"
                    value={detail.routineDetailName}
                    onChange={(e) =>
                      handleDetailChange(
                        dIdx,
                        e.target.value,
                        "routineDetailName"
                      )
                    }
                    disabled={!isEditing}
                  >
                    <MenuItem value="Morning">Morning</MenuItem>
                    <MenuItem value="Evening">Evening</MenuItem>
                  </Select>
                </FormControl>
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
              <Box
                key={sIdx}
                sx={{
                  mt: 2,
                  ml: 2,
                  p: 2,
                  border: "1px solid #ccc",
                  borderRadius: 1,
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <TextField
                      label="Step"
                      fullWidth
                      value={step.step}
                      onChange={(e) =>
                        handleStepChange(
                          dIdx,
                          sIdx,
                          Number(e.target.value),
                          "step"
                        )
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
                        handleStepChange(
                          dIdx,
                          sIdx,
                          e.target.value,
                          "instruction"
                        )
                      }
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {isEditing ? (
                      <Select
                        label="Category"
                        fullWidth
                        value={step.categoryId}
                        onChange={(e) =>
                          handleStepChange(
                            dIdx,
                            sIdx,
                            Number(e.target.value),
                            "categoryId"
                          )
                        }
                      >
                        {categories.map((category) => (
                          <MenuItem
                            key={category.categoryId}
                            value={category.categoryId}
                          >
                            {category.categoryName}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <TextField
                        label="Category"
                        fullWidth
                        value={
                          categories.find(
                            (c) => c.categoryId === step.categoryId
                          )?.categoryName || ""
                        }
                        disabled
                      />
                    )}
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
            Update Routine
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RoutineDetail;
