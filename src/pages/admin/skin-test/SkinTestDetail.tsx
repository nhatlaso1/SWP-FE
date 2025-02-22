import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box, CircularProgress, IconButton, TextField, Stack } from '@mui/material';
import { getSkinTestById, updateSkinTest } from '../../../apis/skinTest.api'; // Import hàm lấy và cập nhật Skin Test
import { SkinTest, SkinTypeQuestion, SkinTypeAnswer } from '../../../types/SkinTest'; // Import interface SkinTest
import DeleteIcon from '@mui/icons-material/Delete';

const SkinTestDetail: React.FC = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const navigate = useNavigate();
    const [skinTest, setSkinTest] = useState<SkinTest | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
  
    // Lấy token từ localStorage
    const token = localStorage.getItem("token");
  
    useEffect(() => {
        const fetchSkinTestDetails = async () => {
            setLoading(true);
            setError(null);
  
            if (id && token) {
                try {
                    const fetchedSkinTest = await getSkinTestById(parseInt(id), token); // Truyền token vào API
                    setSkinTest(fetchedSkinTest);
                } catch (error) {
                    setError('Không thể tải dữ liệu bộ câu hỏi.');
                    console.error("Error fetching skin test details:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setError('ID bộ câu hỏi không hợp lệ hoặc token không có.');
                setLoading(false);
            }
        };
  
        fetchSkinTestDetails();
    }, [id, token]);
  
    const handleBack = () => {
        navigate('/admin/allskintest');  // Quay lại trang danh sách
    };

    const handleUpdate = async () => {
        if (!skinTest) return;
        const payload = {
            skinTestName: skinTest.skinTestName,
            status: skinTest.status,
            skinTypeQuestions: skinTest.skinTypeQuestions?.map((q: SkinTypeQuestion) => ({
                description: q.description,
                skinTypeAnswers: q.skinTypeAnswers.map((a: SkinTypeAnswer) => ({
                    description: a.description,
                    skinTypeId: a.skinTypeId,
                })),
            })),
        };
        try {
            await updateSkinTest(payload, token!);
            setError("Cập nhật bộ câu hỏi thành công!");
        } catch (error) {
            setError("Lỗi khi cập nhật bộ câu hỏi.");
        }
    };
  
    const handleChangeQuestion = (index: number, newDescription: string) => {
        const updatedSkinTest = { ...skinTest! };
        updatedSkinTest.skinTypeQuestions![index].description = newDescription;
        setSkinTest(updatedSkinTest);
    };
  
    const handleAddAnswer = (questionIndex: number) => {
        const updatedSkinTest = { ...skinTest! };
        updatedSkinTest.skinTypeQuestions![questionIndex].skinTypeAnswers.push({
            description: "",
            skinTypeId: 1,
        });
        setSkinTest(updatedSkinTest);
    };
  
    const handleChangeAnswer = (questionIndex: number, answerIndex: number, newDescription: string) => {
        const updatedSkinTest = { ...skinTest! };
        updatedSkinTest.skinTypeQuestions![questionIndex].skinTypeAnswers[answerIndex].description = newDescription;
        setSkinTest(updatedSkinTest);
    };

    const handleDeleteAnswer = (questionIndex: number, answerIndex: number) => {
        const updatedSkinTest = { ...skinTest! };
        updatedSkinTest.skinTypeQuestions![questionIndex].skinTypeAnswers.splice(answerIndex, 1);
        setSkinTest(updatedSkinTest);
    };

    const handleDeleteQuestion = (index: number) => {
        const updatedSkinTest = { ...skinTest! };
        updatedSkinTest.skinTypeQuestions!.splice(index, 1);
        setSkinTest(updatedSkinTest);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }
  
    if (error) {
        return <Typography color="error">{error}</Typography>;
    }
  
    if (!skinTest) {
        return <Typography>Không tìm thấy bộ câu hỏi.</Typography>;
    }
  
    return (
        <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
            <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <Typography variant="h4">Chi tiết bộ câu hỏi</Typography>
                <Button variant="contained" color="secondary" onClick={handleBack}>
                    Quay lại danh sách
                </Button>
            </Box>
  
            <Paper sx={{ padding: 3 }}>
                <Typography variant="h5">Tên bộ câu hỏi: {skinTest.skinTestName}</Typography>
                <Typography variant="body1">Trạng thái: {skinTest.status ? "Hoạt động" : "Không hoạt động"}</Typography>
  
                {skinTest.skinTypeQuestions && Array.isArray(skinTest.skinTypeQuestions) && skinTest.skinTypeQuestions.length > 0 ? (
  skinTest.skinTypeQuestions.map((question, qIndex) => (
    <Box key={qIndex} sx={{ marginBottom: 3 }}>
      <Typography variant="h6">Câu hỏi {qIndex + 1}:</Typography>
      <TextField
        fullWidth
        label="Nội dung câu hỏi"
        value={question.description}
        onChange={(e) => handleChangeQuestion(qIndex, e.target.value)}
        variant="outlined"
        margin="normal"
      />
      {question.skinTypeAnswers?.map((answer, aIndex) => (
        <Stack direction="row" spacing={2} key={aIndex} alignItems="center" marginBottom={1}>
          <TextField
            label={`Đáp án ${aIndex + 1}`}
            variant="outlined"
            value={answer.description}
            onChange={(e) => handleChangeAnswer(qIndex, aIndex, e.target.value)}
          />
          <IconButton
            onClick={() => handleDeleteAnswer(qIndex, aIndex)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ))}
      <Button onClick={() => handleAddAnswer(qIndex)} variant="contained" color="primary">
        Thêm đáp án
      </Button>
      <IconButton
        onClick={() => handleDeleteQuestion(qIndex)}
        color="error"
        sx={{ marginTop: 1 }}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  ))
) : (
  <Typography color="error">Không có câu hỏi nào để hiển thị.</Typography>
)}

                <Button onClick={handleUpdate} variant="contained" color="success">
                    Cập nhật bộ câu hỏi
                </Button>
            </Paper>
        </Container>
    );
};

export default SkinTestDetail;
