import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FormControl, InputLabel } from "@mui/material";
import {
  Button,
  Typography,
  TextField,
  Box,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStore } from "../../../store";
import { createSkinTest, getAllSkinTypes } from "../../../store/skinTest.api";

const CreateSkinTest = () => {
  const navigate = useNavigate();
  const token = useStore((state) => state.profile.user?.token);

  // Ở trang Create luôn ở chế độ nhập liệu
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinTest, setSkinTest] = useState({
    skinTestId: 0,
    skinTestName: "",
    status: true,
    skinTypeQuestions: [],
  });

  useEffect(() => {
    fetchSkinTypes();
  }, []);

  const fetchSkinTypes = async () => {
    try {
      const data = await getAllSkinTypes(token);
      if (data) {
        const types = data.$values ? data.$values : data;
        setSkinTypes(types);
      }
    } catch (error) {
      console.error("Error fetching skin types:", error);
    }
  };

  const handleAddQuestion = () => {
    setSkinTest((prev) => ({
      ...prev,
      skinTypeQuestions: [
        ...prev.skinTypeQuestions,
        {
          skinTypeQuestionId: Date.now(),
          description: "abc",
          status: true, // Mặc định là Single Choice
          skinTypeAnswers: [],
        },
      ],
    }));
  };

  const handleDeleteQuestion = (questionId) => {
    setSkinTest((prev) => ({
      ...prev,
      skinTypeQuestions: prev.skinTypeQuestions.filter(
        (q) => q.skinTypeQuestionId !== questionId
      ),
    }));
  };

  const handleAddAnswer = (questionId) => {
    setSkinTest((prev) => ({
      ...prev,
      skinTypeQuestions: prev.skinTypeQuestions.map((q) =>
        q.skinTypeQuestionId === questionId
          ? {
              ...q,
              skinTypeAnswers: [
                ...q.skinTypeAnswers,
                {
                  skinTypeAnswerId: Date.now(),
                  description: "",
                  skinTypeId: "",
                },
              ],
            }
          : q
      ),
    }));
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    setSkinTest((prev) => ({
      ...prev,
      skinTypeQuestions: prev.skinTypeQuestions.map((q) =>
        q.skinTypeQuestionId === questionId
          ? {
              ...q,
              skinTypeAnswers: q.skinTypeAnswers.filter(
                (a) => a.skinTypeAnswerId !== answerId
              ),
            }
          : q
      ),
    }));
  };

  const handleChange = (field, value) => {
    setSkinTest((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (questionId, value, field) => {
    setSkinTest((prev) => ({
      ...prev,
      skinTypeQuestions: prev.skinTypeQuestions.map((q) =>
        q.skinTypeQuestionId === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleAnswerChange = (questionId, answerId, value, field) => {
    setSkinTest((prev) => ({
      ...prev,
      skinTypeQuestions: prev.skinTypeQuestions.map((q) =>
        q.skinTypeQuestionId === questionId
          ? {
              ...q,
              skinTypeAnswers: q.skinTypeAnswers.map((a) =>
                a.skinTypeAnswerId === answerId ? { ...a, [field]: value } : a
              ),
            }
          : q
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      await createSkinTest(skinTest, token);
      navigate("/admin/skintests");
    } catch (error) {
      console.error("Error saving skin test:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Skin Test
      </Typography>

      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={9}>
          <TextField
            label="Test Name"
            fullWidth
            value={skinTest.skinTestName}
            onChange={(e) => handleChange("skinTestName", e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Select
            value={skinTest.status ? "Active" : "Inactive"}
            onChange={(e) =>
              handleChange("status", e.target.value === "Active")
            }
            fullWidth
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </Select>
        </Grid>
      </Grid>

      {skinTest.skinTypeQuestions.map((question) => (
        <Box
          key={question.skinTypeQuestionId}
          border={1}
          padding={3}
          borderRadius={2}
          marginBottom={3}
          boxShadow={2}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <TextField
                label="Question"
                fullWidth
                multiline
                rows={3}
                value={question.description}
                onChange={(e) =>
                  handleQuestionChange(
                    question.skinTypeQuestionId,
                    e.target.value,
                    "description"
                  )
                }
              />
            </Grid>
            <Grid
              item
              xs={4}
              container
              spacing={1}
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    handleDeleteQuestion(question.skinTypeQuestionId)
                  }
                  startIcon={<DeleteIcon />}
                >
                  Delete Question
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Select
                  value={question.status}
                  onChange={(e) =>
                    handleQuestionChange(
                      question.skinTypeQuestionId,
                      e.target.value,
                      "status"
                    )
                  }
                  fullWidth
                >
                  <MenuItem value={true}>Single Choice</MenuItem>
                  <MenuItem value={false}>Multiple Choice</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>

          {question.skinTypeAnswers.map((answer) => (
            <Grid
              key={answer.skinTypeAnswerId}
              container
              alignItems="center"
              spacing={2}
              sx={{ marginBottom: 1 }}
            >
              <Grid item xs={8}>
                <TextField
                  label="Answer"
                  fullWidth
                  value={answer.description}
                  onChange={(e) =>
                    handleAnswerChange(
                      question.skinTypeQuestionId,
                      answer.skinTypeAnswerId,
                      e.target.value,
                      "description"
                    )
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel id="skin-type-label">Choose Skin Type</InputLabel>
                  <Select
                    labelId="skin-type-label"
                    label="Choose Skin Type"
                    value={answer.skinTypeId || ""}
                    displayEmpty
                    onChange={(e) =>
                      handleAnswerChange(
                        question.skinTypeQuestionId,
                        answer.skinTypeAnswerId,
                        Number(e.target.value),
                        "skinTypeId"
                      )
                    }
                  >
                    {Array.isArray(skinTypes) &&
                      skinTypes.map((type) => (
                        <MenuItem key={type.skinTypeId} value={type.skinTypeId}>
                          {type.skinTypeName}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={1}>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={() =>
                    handleDeleteAnswer(
                      question.skinTypeQuestionId,
                      answer.skinTypeAnswerId
                    )
                  }
                  startIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          ))}

          <Box sx={{ marginTop: 2 }}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleAddAnswer(question.skinTypeQuestionId)}
              sx={{ marginRight: 2 }}
            >
              Add Answer
            </Button>
          </Box>
        </Box>
      ))}

      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddQuestion}
          startIcon={<AddIcon />}
          sx={{ marginRight: 2 }}
        >
          Add Question
        </Button>
      </Box>

      <Button variant="contained" color="secondary" onClick={handleSubmit}>
        Create SkinTest
      </Button>
    </Box>
  );
};

export default CreateSkinTest;
