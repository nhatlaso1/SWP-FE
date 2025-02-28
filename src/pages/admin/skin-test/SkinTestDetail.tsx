// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { Container, Paper, Typography, Button, Box, CircularProgress, IconButton, TextField, Stack } from '@mui/material';
// // import { getSkinTestById, updateSkinTest } from '../../../store/skinTest.api'; // Import hàm lấy và cập nhật Skin Test
// // import { SkinTest, SkinTypeQuestion, SkinTypeAnswer, ApiSkinTypeAnswer, ApiSkinTest } from '../../../types/SkinTest'; // Import interface SkinTest
// // import DeleteIcon from '@mui/icons-material/Delete';

// // const SkinTestDetail: React.FC = () => {
// //     const { id } = useParams(); // Lấy ID từ URL
// //     const navigate = useNavigate();
// //     const [skinTest, setSkinTest] = useState<SkinTest | null>(null);
// //     const [loading, setLoading] = useState<boolean>(false);
// //     const [error, setError] = useState<string | null>(null);

// //     // Lấy token từ localStorage
// //     const token = localStorage.getItem("token");

// //     // useEffect(() => {
// //     //     const fetchSkinTest = async () => {
// //     //         if (!id || !token) return;
    
// //     //         try {
// //     //             const fetchedSkinTest = await getSkinTestById(parseInt(id), token);
// //     //             console.log("Dữ liệu nhận được từ API:", fetchedSkinTest);
// //     //             setSkinTest(fetchedSkinTest as ApiSkinTest); // Ép kiểu tạm thời
// //     //         } catch (error) {
// //     //             setError('Không thể tải dữ liệu bộ câu hỏi.');
// //     //             console.error("Lỗi khi gọi API:", error);
// //     //         }
// //     //     };
    
// //     //     fetchSkinTest();
// //     // }, [id, token]);
    


// //     const handleBack = () => {
// //         navigate('/admin/allskintest');  // Quay lại trang danh sách
// //     };

// //     const handleChangeQuestion = (index: number, newDescription: string) => {
// //         const updatedQuestions = [...skinTest!.skinTypeQuestions];
// //         updatedQuestions[index].description = newDescription;
// //         setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
// //     };

// //     const handleAddAnswer = (questionIndex: number) => {
// //         const updatedQuestions = [...skinTest!.skinTypeQuestions];
// //         const newAnswer: ApiSkinTypeAnswer = {
// //             skinTypeAnswerId: 0, // ID giả, server sẽ cập nhật
// //             description: "",
// //             skinTypeId: 1,
// //         };
// //         updatedQuestions[questionIndex].skinTypeAnswers.push(newAnswer as any); // ép kiểu tạm thời
// //         setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
// //     };


// //     const handleChangeAnswer = (questionIndex: number, answerIndex: number, newDescription: string) => {
// //         const updatedQuestions = [...skinTest!.skinTypeQuestions];
// //         updatedQuestions[questionIndex].skinTypeAnswers[answerIndex].description = newDescription;
// //         setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
// //     };

// //     const handleDeleteAnswer = (questionIndex: number, answerIndex: number) => {
// //         const updatedQuestions = [...skinTest!.skinTypeQuestions];
// //         updatedQuestions[questionIndex].skinTypeAnswers.splice(answerIndex, 1);
// //         setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
// //     };

// //     const handleDeleteQuestion = (index: number) => {
// //         const updatedQuestions = [...skinTest!.skinTypeQuestions];
// //         updatedQuestions.splice(index, 1);
// //         setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
// //     };
// //     // const handleUpdateSkinTest = async () => {
// //     //     if (!token || !skinTest) {
// //     //         setError('Token không hợp lệ hoặc không có dữ liệu để cập nhật.');
// //     //         return;
// //     //     }
    
// //     //     try {
// //     //         const updateData = {
// //     //             skinTestId: (skinTest as ApiSkinTest).id || 0,
// //     //             skinTestName: skinTest.skinTestName,
// //     //             status: (skinTest as ApiSkinTest).status, // Giữ nguyên dạng string
// //     //             skinTypeQuestions: skinTest.skinTypeQuestions.map((question) => ({
// //     //                 skinTypeQuestionId: (question as any).id || 0, // Chấp nhận kiểu `any` tạm thời
// //     //                 description: question.description,
// //     //                 skinTypeAnswers: question.skinTypeAnswers.map((answer) => ({
// //     //                     skinTypeAnswerId: (answer as any).id || 0,
// //     //                     description: answer.description,
// //     //                     skinTypeId: answer.skinTypeId,
// //     //                 })),
// //     //             })),
// //     //         };
    
// //     //         console.log("Dữ liệu gửi lên API:", updateData);
    
// //     //         const result = await updateSkinTest(updateData, token);
// //     //         console.log("Phản hồi từ API:", result);
// //     //         alert('Cập nhật thành công!');
// //     //         navigate('/admin/allskintest');
// //     //     } catch (error) {
// //     //         console.error("Lỗi khi cập nhật Skin Test:", error);
// //     //         setError('Không thể cập nhật bộ câu hỏi.');
// //     //     }
// //     // };
    
// //     if (loading) {
// //         return (
// //             <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
// //                 <CircularProgress />
// //             </Box>
// //         );
// //     }

// //     if (error) {
// //         return <Typography color="error">{error}</Typography>;
// //     }

// //     if (!skinTest) {
// //         return <Typography>Không tìm thấy bộ câu hỏi.</Typography>;
// //     }

// //     return (
// //         <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
// //             <Box display="flex" justifyContent="space-between" marginBottom={2}>
// //                 <Typography variant="h4">Chi tiết bộ câu hỏi</Typography>
// //                 <Button variant="contained" color="secondary" onClick={handleBack}>
// //                     Quay lại danh sách
// //                 </Button>
// //             </Box>

// //             <Paper sx={{ padding: 3 }}>
// //                 <Typography variant="h5">Tên bộ câu hỏi: {skinTest.skinTestName}</Typography>
// //                 <Typography variant="body1">Trạng thái: {skinTest.status ? "Hoạt động" : "Không hoạt động"}</Typography>

// //                 {skinTest.skinTypeQuestions && Array.isArray(skinTest.skinTypeQuestions) && skinTest.skinTypeQuestions.length > 0 ? (
// //                     skinTest.skinTypeQuestions.map((question, qIndex) => (
// //                         <Box key={qIndex} sx={{ marginBottom: 3 }}>
// //                             <Typography variant="h6">Câu hỏi {qIndex + 1}:</Typography>
// //                             <TextField
// //                                 fullWidth
// //                                 label="Nội dung câu hỏi"
// //                                 value={question.description}
// //                                 onChange={(e) => handleChangeQuestion(qIndex, e.target.value)}
// //                                 variant="outlined"
// //                                 margin="normal"
// //                             />
// //                             {question.skinTypeAnswers?.map((answer, aIndex) => (
// //                                 <Stack direction="row" spacing={2} key={aIndex} alignItems="center" marginBottom={1}>
// //                                     <TextField
// //                                         label={`Đáp án ${aIndex + 1}`}
// //                                         variant="outlined"
// //                                         value={answer.description}
// //                                         onChange={(e) => handleChangeAnswer(qIndex, aIndex, e.target.value)}
// //                                     />
// //                                     <IconButton
// //                                         onClick={() => handleDeleteAnswer(qIndex, aIndex)}
// //                                         color="error"
// //                                     >
// //                                         <DeleteIcon />
// //                                     </IconButton>
// //                                 </Stack>
// //                             ))}
// //                             <Button onClick={() => handleAddAnswer(qIndex)} variant="contained" color="primary">
// //                                 Thêm đáp án
// //                             </Button>
// //                             <IconButton
// //                                 onClick={() => handleDeleteQuestion(qIndex)}
// //                                 color="error"
// //                                 sx={{ marginTop: 1 }}
// //                             >
// //                                 <DeleteIcon />
// //                             </IconButton>
// //                         </Box>
// //                     ))
// //                 ) : (
// //                     <Typography color="error">Không có câu hỏi nào để hiển thị.</Typography>
// //                 )}

// //                 <Button
// //                     variant="contained"
// //                     color="success"
// //                     // onClick={handleUpdateSkinTest}
// //                 >
// //                     Cập nhật bộ câu hỏi
// //                 </Button>
// //             </Paper>
// //         </Container>
// //     );
// // };

// // export default SkinTestDetail;

// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Container, Paper, Typography, Button, Box, CircularProgress, IconButton, TextField, Stack } from '@mui/material';
// import { getSkinTestById, updateSkinTest } from '../../../store/skinTest.api';
// import { SkinTest, ApiSkinTest, UpdateSkinTest } from '../../../types/SkinTest';
// import DeleteIcon from '@mui/icons-material/Delete';

// const SkinTestDetail: React.FC = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [skinTest, setSkinTest] = useState<ApiSkinTest | null>(null);
//     const [loading, setLoading] = useState<boolean>(false);
//     const [error, setError] = useState<string | null>(null);
  
//     const token = localStorage.getItem("token");
  
//     useEffect(() => {
//       const fetchSkinTest = async () => {
//         if (!id || !token) {
//           setError('ID hoặc token không hợp lệ.');
//           return;
//         }
  
//         setLoading(true);
//         try {
//           const rawData = await getSkinTestById(parseInt(id), token);
//           if (rawData) {
//             const fetchedSkinTest: ApiSkinTest = {
//               skinTestId: rawData.skinTestId,
//               skinTestName: rawData.skinTestName,
//               status: rawData.status,
//               skinTypeQuestions: rawData.skinTypeQuestions.$values.map((q: any) => ({
//                 skinTypeQuestionId: q.skinTypeQuestionId,
//                 description: q.description,
//                 skinTypeAnswers: q.skinTypeAnswers.$values.map((a: any) => ({
//                   skinTypeAnswerId: a.skinTypeAnswerId,
//                   description: a.description,
//                   skinTypeId: a.skinTypeId,
//                 })),
//               })),
//             };
//             console.log("Dữ liệu nhận được từ API:", fetchedSkinTest);
//             setSkinTest(fetchedSkinTest);
//           } else {
//             setError('Bộ câu hỏi không tồn tại.');
//           }
//         } catch (error) {
//           setError('Không thể tải dữ liệu bộ câu hỏi.');
//           console.error("Lỗi khi gọi API:", error);
//         } finally {
//           setLoading(false);
//         }
//       };
  
//       fetchSkinTest();
//     }, [id, token]);
  
//     const handleBack = () => {
//       navigate('/admin/allskintest');
//     };
  
//     const handleChangeQuestion = (index: number, newDescription: string) => {
//       const updatedQuestions = [...skinTest!.skinTypeQuestions];
//       updatedQuestions[index].description = newDescription;
//       setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
//     };
  
//     const handleAddAnswer = (questionIndex: number) => {
//       const updatedQuestions = [...skinTest!.skinTypeQuestions];
//       const newAnswer = {
//         description: "",
//         skinTypeId: 1,
//       };
//       updatedQuestions[questionIndex].skinTypeAnswers.push(newAnswer);
//       setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
//     };
  
//     const handleChangeAnswer = (questionIndex: number, answerIndex: number, newDescription: string) => {
//       const updatedQuestions = [...skinTest!.skinTypeQuestions];
//       updatedQuestions[questionIndex].skinTypeAnswers[answerIndex].description = newDescription;
//       setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
//     };
  
//     const handleDeleteAnswer = (questionIndex: number, answerIndex: number) => {
//       const updatedQuestions = [...skinTest!.skinTypeQuestions];
//       updatedQuestions[questionIndex].skinTypeAnswers.splice(answerIndex, 1);
//       setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
//     };
  
//     const handleDeleteQuestion = (index: number) => {
//       const updatedQuestions = [...skinTest!.skinTypeQuestions];
//       updatedQuestions.splice(index, 1);
//       setSkinTest({ ...skinTest!, skinTypeQuestions: updatedQuestions });
//     };
  
//     const handleUpdateSkinTest = async () => {
//       if (!token || !skinTest) {
//         setError('Token không hợp lệ hoặc không có dữ liệu để cập nhật.');
//         return;
//       }
  
//       setLoading(true);
//       try {
//         const updateData: UpdateSkinTest = {
//             skinTestId: skinTest.skinTestId,
//             skinTestName: skinTest.skinTestName,
//             status: skinTest.status === "active", // Chuyển đổi string thành boolean
//             skinTypeQuestions: skinTest.skinTypeQuestions.map((question) => ({
//               description: question.description,
//               skinTypeAnswers: question.skinTypeAnswers.map((answer) => ({
//                 description: answer.description,
//                 skinTypeId: answer.skinTypeId,
//               })),
//             })),
//           };
          
//         console.log("Dữ liệu gửi lên API:", updateData);
//         const result = await updateSkinTest(updateData, token);
//         console.log("Phản hồi từ API:", result);
//         alert('Cập nhật thành công!');
//         navigate('/admin/allskintest');
//       } catch (error) {
//         console.error("Lỗi khi cập nhật Skin Test:", error);
//         setError('Không thể cập nhật bộ câu hỏi.');
//       } finally {
//         setLoading(false);
//       }
//     };
  
//     if (loading) {
//       return (
//         <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
//           <CircularProgress />
//         </Box>
//       );
//     }
  
//     if (error) {
//       return <Typography color="error">{error}</Typography>;
//     }
  
//     if (!skinTest) {
//       return <Typography>Không tìm thấy bộ câu hỏi.</Typography>;
//     }
  
//     return (
//       <Container maxWidth="lg" sx={{ paddingTop: 4 }}>
//         <Box display="flex" justifyContent="space-between" marginBottom={2}>
//           <Typography variant="h4">Chi tiết bộ câu hỏi</Typography>
//           <Button variant="contained" color="secondary" onClick={handleBack}>
//             Quay lại danh sách
//           </Button>
//         </Box>
  
//         <Paper sx={{ padding: 3 }}>
//           <Typography variant="h5">Tên bộ câu hỏi: {skinTest.skinTestName}</Typography>
//           <Typography variant="body1">Trạng thái: {skinTest.status ? "Hoạt động" : "Không hoạt động"}</Typography>
  
//           {skinTest.skinTypeQuestions && Array.isArray(skinTest.skinTypeQuestions) && skinTest.skinTypeQuestions.length > 0 ? (
//             skinTest.skinTypeQuestions.map((question, qIndex) => (
//               <Box key={qIndex} sx={{ marginBottom: 3 }}>
//                 <Typography variant="h6">Câu hỏi {qIndex + 1}:</Typography>
//                 <TextField
//                   fullWidth
//                   label="Nội dung câu hỏi"
//                   value={question.description}
//                   onChange={(e) => handleChangeQuestion(qIndex, e.target.value)}
//                   variant="outlined"
//                   margin="normal"
//                 />
//                 {question.skinTypeAnswers?.map((answer, aIndex) => (
//                   <Stack direction="row" spacing={2} key={aIndex} alignItems="center" marginBottom={1}>
//                     <TextField
//                       label={`Đáp án ${aIndex + 1}`}
//                       variant="outlined"
//                       value={answer.description}
//                       onChange={(e) => handleChangeAnswer(qIndex, aIndex, e.target.value)}
//                     />
//                     <IconButton
//                       onClick={() => handleDeleteAnswer(qIndex, aIndex)}
//                       color="error"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </Stack>
//                 ))}
//                 <Button onClick={() => handleAddAnswer(qIndex)} variant="contained" color="primary">
//                   Thêm đáp án
//                 </Button>
//                 <IconButton
//                   onClick={() => handleDeleteQuestion(qIndex)}
//                   color="error"
//                   sx={{ marginTop: 1 }}
//                 >
//                   <DeleteIcon />
//                 </IconButton>
//               </Box>
//             ))
//           ) : (
//             <Typography color="error">Không có câu hỏi nào để hiển thị.</Typography>
//           )}
  
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleUpdateSkinTest}
//           >
//             Cập nhật bộ câu hỏi
//           </Button>
//         </Paper>
//       </Container>
//     );
//   };

// export default SkinTestDetail;
export {};
