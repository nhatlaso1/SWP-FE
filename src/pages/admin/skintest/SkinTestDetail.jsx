import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Box,
  IconButton,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStore } from "../../../store";
import {
  getSkinTestById,
  updateSkinTest,
  getAllSkinTypes,
} from "../../../store/skinTest.api";

const SkinTestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useStore((state) => state.profile.user?.token);

  // Nếu không có id => chế độ tạo mới (Create)
  const isCreating = !id;
  const [isEditing, setIsEditing] = useState(isCreating);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinTest, setSkinTest] = useState({
    skinTestId: 0,
    skinTestName: "",
    status: true,
    skinTypeQuestions: [],
  });

  useEffect(() => {
    if (!isCreating && id) {
      fetchSkinTest(Number(id));
    }
    fetchSkinTypes();
  }, [id, isCreating]);

  const fetchSkinTest = async (skinTestId) => {
    try {
      const data = await getSkinTestById(skinTestId, token);
      console.log("Full data from API:", JSON.stringify(data));

      if (data) {
        // Lấy mảng câu hỏi từ skinTypeQuestions.$values nếu có
        const questions = data.skinTypeQuestions?.$values
          ? data.skinTypeQuestions.$values
          : data.skinTypeQuestions;
        console.log("Extracted questions array:", JSON.stringify(questions));

        // In log từng câu hỏi để kiểm tra id và các trường khác
        if (Array.isArray(questions)) {
          questions.forEach((q, index) => {
            console.log(`Question ${index}:`, q);
          });
        }

        // Map từng câu hỏi:
        // Nếu có trường "type", dùng nó; nếu không có, thử dùng "status" (nếu có), còn nếu chưa có thì mặc định true
        const mappedQuestions = Array.isArray(questions)
          ? questions.map((q) => {
              const mappedStatus =
                q.type !== undefined
                  ? q.type
                  : q.status !== undefined
                  ? q.status
                  : true;
              return {
                ...q,
                status: mappedStatus,
                skinTypeAnswers: q.skinTypeAnswers?.$values
                  ? q.skinTypeAnswers.$values
                  : q.skinTypeAnswers || [],
              };
            })
          : [];
        console.log("Mapped questions:", JSON.stringify(mappedQuestions));

        const payload = {
          ...data,
          skinTypeQuestions: mappedQuestions,
        };
        console.log("Final payload set to state:", JSON.stringify(payload));

        setSkinTest(payload);
      }
    } catch (error) {
      console.error("Error fetching skin test:", error);
    }
  };

  const fetchSkinTypes = async () => {
    try {
      const data = await getAllSkinTypes(token);
      console.log("Skin types from API:", JSON.stringify(data));
      if (data) {
        const types = data.$values ? data.$values : data;
        console.log("Mapped skin types:", types);
        setSkinTypes(types);
      }
    } catch (error) {
      console.error("Error fetching skin types:", error);
    }
  };

  // Các hàm xử lý thêm, cập nhật, xóa câu hỏi và đáp án

  const handleAddQuestion = () => {
    setSkinTest((prev) => {
      const newQuestion = {
        skinTypeQuestionId: Date.now(),
        description: "",
        status: true,
        skinTypeAnswers: [],
      };
      console.log("Adding question:", newQuestion);
      return {
        ...prev,
        skinTypeQuestions: [...prev.skinTypeQuestions, newQuestion],
      };
    });
  };

  const handleAddAnswer = (questionId) => {
    setSkinTest((prev) => {
      const updatedQuestions = prev.skinTypeQuestions.map((q) =>
        q.skinTypeQuestionId === questionId
          ? {
              ...q,
              skinTypeAnswers: [
                ...q.skinTypeAnswers,
                {
                  skinTypeAnswerId: Date.now(),
                  description: "",
                  skinTypeId: null, // thay vì "" để tránh chuyển đổi sang 0
                },
              ],
            }
          : q
      );
      console.log("Adding answer to questionId", questionId, updatedQuestions);
      return {
        ...prev,
        skinTypeQuestions: updatedQuestions,
      };
    });
  };

  const handleDeleteAnswer = (questionId, answerId) => {
    setSkinTest((prev) => {
      const updatedQuestions = prev.skinTypeQuestions.map((q) =>
        q.skinTypeQuestionId === questionId
          ? {
              ...q,
              skinTypeAnswers: q.skinTypeAnswers.filter(
                (a) => a.skinTypeAnswerId !== answerId
              ),
            }
          : q
      );
      console.log(
        "Deleting answer",
        answerId,
        "from question",
        questionId,
        updatedQuestions
      );
      return {
        ...prev,
        skinTypeQuestions: updatedQuestions,
      };
    });
  };

  const handleChange = (field, value) => {
    console.log(`Changing field ${field} to:`, value);
    setSkinTest((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (questionId, value, field) => {
    console.log(`Changing question ${questionId} field ${field} to:`, value);
    setSkinTest((prev) => ({
      ...prev,
      skinTypeQuestions: prev.skinTypeQuestions.map((q) =>
        q.skinTypeQuestionId === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  const handleAnswerChange = (questionId, answerId, value, field) => {
    console.log(
      `Changing answer ${answerId} in question ${questionId} field ${field} to:`,
      value
    );
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
    console.log("Submitting skin test payload:", skinTest);
    try {
      await updateSkinTest(skinTest, token);
      navigate("/admin/skintests");
    } catch (error) {
      console.error("Error saving skin test:", error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        {isCreating ? "Create Skin Test" : "Skin Test Detail"}
      </Typography>

      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant="outlined"
          onClick={() => setIsEditing(!isEditing)}
          sx={{ marginRight: 2 }}
        >
          {isEditing ? "View Detail" : "Edit"}
        </Button>
      </Box>

      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={9}>
          <TextField
            label="Test Name"
            fullWidth
            value={skinTest.skinTestName}
            onChange={(e) => handleChange("skinTestName", e.target.value)}
            disabled={!isEditing}
          />
        </Grid>
        <Grid item xs={3}>
          {isEditing ? (
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
          ) : (
            <Typography>
              Status: {skinTest.status ? "Active" : "Inactive"}
            </Typography>
          )}
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
          <Box
            sx={{
              backgroundColor: "#f5f5f5",
              padding: 2,
              borderRadius: 1,
              marginBottom: 2,
            }}
          >
            <Grid container spacing={2} alignItems="flex-start">
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
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={4}>
                {isEditing ? (
                  <Select
                    value={
                      question.status ? "Single Choice" : "Multiple Choice"
                    }
                    onChange={(e) =>
                      handleQuestionChange(
                        question.skinTypeQuestionId,
                        e.target.value === "Single Choice",
                        "status"
                      )
                    }
                    fullWidth
                  >
                    <MenuItem value="Single Choice">Single Choice</MenuItem>
                    <MenuItem value="Multiple Choice">Multiple Choice</MenuItem>
                  </Select>
                ) : (
                  <Typography variant="subtitle1">
                    {question.status ? "Single Choice" : "Multiple Choice"}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>

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
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={3}>
                {isEditing ? (
                  <Select
                    value={answer.skinTypeId !== null ? answer.skinTypeId : ""}
                    onChange={(e) =>
                      handleAnswerChange(
                        question.skinTypeQuestionId,
                        answer.skinTypeAnswerId,
                        Number(e.target.value),
                        "skinTypeId"
                      )
                    }
                    fullWidth
                  >
                    {Array.isArray(skinTypes) &&
                      skinTypes.map((type) => (
                        <MenuItem key={type.skinTypeId} value={type.skinTypeId}>
                          {type.skinTypeName}
                        </MenuItem>
                      ))}
                  </Select>
                ) : (
                  <TextField
                    value={
                      Array.isArray(skinTypes)
                        ? skinTypes.find(
                            (type) => type.skinTypeId === answer.skinTypeId
                          )?.skinTypeName || "Unknown"
                        : "Unknown"
                    }
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                )}
              </Grid>
              {isEditing && (
                <Grid item xs={1}>
                  <IconButton
                    onClick={() =>
                      handleDeleteAnswer(
                        question.skinTypeQuestionId,
                        answer.skinTypeAnswerId
                      )
                    }
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
          ))}

          {isEditing && (
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
          )}
        </Box>
      ))}

      {isEditing && (
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
      )}

      {isEditing && (
        <Button variant="contained" color="secondary" onClick={handleSubmit}>
          {isCreating ? "Create SkinTest" : "Update SkinTest"}
        </Button>
      )}
    </Box>
  );
};

export default SkinTestDetail;
