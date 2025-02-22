import React, { useState } from "react";
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
  Stack,
  Select,
  MenuItem,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { createSkinTest } from "../../../apis/skinTest.api";
import { useStore } from "../../../store";

interface Answer {
  answer: string;
  skinTypeId: number;
}

interface Question {
  question: string;
  answers: Answer[];
}

interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

const skinTypes = [
  { id: 1, name: "Da dầu" },
  { id: 2, name: "Da khô" },
  { id: 3, name: "Da hỗn hợp" },
  { id: 4, name: "Da nhạy cảm" },
];

const CreateSkinTests: React.FC = () => {
  const [testName, setTestName] = useState<string>("");
  const [status, setStatus] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", answers: [{ answer: "", skinTypeId: 1 }] },
  ]);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
  });

  const token = useStore((store) => store.profile.user?.token);
  const userRole = useStore((store) => store.profile.user?.role);

  const formatPayload = () => ({
    skinTestName: testName,
    status: status,
    skinTypeQuestions: questions.map((q) => ({
      description: q.question,
      skinTypeAnswers: q.answers.map((a) => ({
        description: a.answer,
        skinTypeId: Number(a.skinTypeId),
      })),
    })),
  });

  const handleSaveTest = async () => {
    if (!token) {
      setSnackbar({
        open: true,
        message: "Bạn chưa đăng nhập!",
        severity: "error",
      });
      return;
    }

    const payload = formatPayload();
    try {
      await createSkinTest(payload, token);
      setSnackbar({
        open: true,
        message: "Lưu bộ câu hỏi thành công!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Lỗi khi lưu bộ câu hỏi!",
        severity: "error",
      });
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answers: [{ answer: "", skinTypeId: 1 }] }]);
  };

  return (
    <Box className="skin-test-container">
      <Container maxWidth="md">
        <Paper className="skin-test-paper">
          <Typography variant="h4" align="center" color="secondary" gutterBottom>
            Tạo bộ câu hỏi
          </Typography>

          <TextField
            fullWidth
            label="Tên bộ câu hỏi"
            variant="outlined"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            className="input-field"
            margin="normal"
          />

          {questions.map((q, qIndex) => (
            <Paper key={qIndex} className="question-box" sx={{ padding: 2, marginBottom: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Câu hỏi {qIndex + 1}</Typography>
                <IconButton
                  onClick={() => setQuestions(questions.filter((_, i) => i !== qIndex))}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
              <TextField
                fullWidth
                label="Nội dung câu hỏi"
                variant="outlined"
                value={q.question}
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[qIndex].question = e.target.value;
                  setQuestions(updatedQuestions);
                }}
                margin="normal"
              />
              {q.answers.map((a, aIndex) => (
                <Stack key={aIndex} direction="row" spacing={2} alignItems="center" marginBottom={1}>
                  <TextField
                    label={`Đáp án ${aIndex + 1}`}
                    variant="outlined"
                    value={a.answer}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[qIndex].answers[aIndex].answer = e.target.value;
                      setQuestions(updatedQuestions);
                    }}
                  />
                  <Select
                    value={a.skinTypeId}
                    onChange={(e) => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[qIndex].answers[aIndex].skinTypeId = Number(e.target.value);
                      setQuestions(updatedQuestions);
                    }}
                  >
                    {skinTypes.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                  <IconButton
                    onClick={() => {
                      const updatedQuestions = [...questions];
                      updatedQuestions[qIndex].answers = updatedQuestions[qIndex].answers.filter((_, i) => i !== aIndex);
                      setQuestions(updatedQuestions);
                    }}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              ))}
              <Button
                onClick={() => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[qIndex].answers.push({ answer: "", skinTypeId: 1 });
                  setQuestions(updatedQuestions);
                }}
                startIcon={<AddCircleOutlineIcon />}
              >
                Thêm đáp án
              </Button>
            </Paper>
          ))}

          <Button onClick={handleAddQuestion} variant="contained" color="primary" sx={{ marginRight: 2 }}>
            Thêm câu hỏi
          </Button>

          <Button onClick={handleSaveTest} variant="contained" color="success">
            Lưu bộ câu hỏi
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
