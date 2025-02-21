import React, { useState } from "react";
import "./SkinTest";
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const CreateSkinTests = () => {
  const [testName, setTestName] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answers: [""] }]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answers: [""] }]);
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers[aIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleAddAnswer = (qIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers.push("");
    setQuestions(updatedQuestions);
  };

  const handleRemoveAnswer = (qIndex, aIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter(
      (_, i) => i !== aIndex
    );
    setQuestions(updatedQuestions);
  };

  const handleSaveTest = async () => {
    const payload = {
      skinTestName: testName,
      status: true,
      skinTypeQuestions: questions.map((q, qIndex) => ({
        skinTypeQuestionId: qIndex,
        description: q.question,
        skinTypeAnswers: q.answers.map((a, aIndex) => ({
          skinTypeAnswerId: aIndex,
          description: a,
          skinTypeId: 0,
        })),
      })),
    };

    console.log("Payload gửi lên:", JSON.stringify(payload, null, 2));

    try {
      await axios.post(
        "https://localhost:7130/api/SkinTest/create-skin-test",
        payload,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJtYW5hZ2VyQGV4YW1wbGUuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTWFuYWdlciIsIm5iZiI6MTc0MDA1NDcxNSwiZXhwIjoxNzQwMDU1NjE1LCJpc3MiOiJodHRwczovL2xvY2FsaG9zdDo3MTMwIiwiYXVkIjoiaHR0cHM6Ly9sb2NhbGhvc3Q6NzEzMCJ9.yn3rJhDnubFMc5jfPKBfS05e4HeElVvuweEABsAodhY`,
            "Content-Type": "application/json",
          },
        }
      );
      setSnackbar({
        open: true,
        message: "Lưu bài test thành công!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi lưu bài test!",
        severity: "error",
      });
    }
  };

  return (
    <Box className="skin-test-container">
      <Container maxWidth="md">
        <Paper className="skin-test-paper">
          <Typography
            variant="h4"
            align="center"
            color="secondary"
            gutterBottom
          >
            Tạo bài test
          </Typography>

          <TextField
            fullWidth
            label="Tên bài test"
            variant="outlined"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="input-field"
          />

          {questions.map((q, qIndex) => (
            <Paper key={qIndex} className="question-box">
              <TextField
                fullWidth
                label={`Câu hỏi ${qIndex + 1}`}
                variant="outlined"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                className="input-field"
              />
              {q.answers.map((a, aIndex) => (
                <Box key={aIndex} className="answer-box">
                  <TextField
                    fullWidth
                    label={`Đáp án ${aIndex + 1}`}
                    variant="outlined"
                    value={a}
                    onChange={(e) =>
                      handleAnswerChange(qIndex, aIndex, e.target.value)
                    }
                    className="input-field"
                  />
                </Box>
              ))}
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                className="action-buttons"
              >
                <Button
                  onClick={() => handleAddAnswer(qIndex)}
                  startIcon={<AddCircleOutlineIcon />}
                  className="add-answer-btn"
                >
                   Thêm đáp án
                </Button>
                <IconButton
                  onClick={() => handleRemoveQuestion(qIndex)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}

          <Button
            onClick={handleAddQuestion}
            startIcon={<AddCircleOutlineIcon />}
            variant="contained"
            className="add-question-btn"
          >
            Thêm câu hỏi
          </Button>

          <Button
            onClick={handleSaveTest}
            variant="contained"
            color="success"
            className="save-test-btn"
          >
            Lưu bài test
          </Button>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateSkinTests;
