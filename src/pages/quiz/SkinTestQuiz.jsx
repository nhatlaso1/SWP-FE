import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  LinearProgress,
  Typography,
  CircularProgress,
  Checkbox,
} from "@mui/material";

import { useStore } from "../../store";
import "./SkinTestQuiz.scss";
import { useNavigate } from "react-router-dom";
import { getAllSkinTests } from "../../store/skinTest.api";

const SkinTestQuiz = () => {
  const navigate = useNavigate();
  const skinRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const fetchQuestionsSkinTest = useStore(
    (state) => state.fetchQuestionsSkinTest
  );
  const determineSkinType = useStore((state) => state.determineSkinType);
  const [step, setStep] = useState(1);
  const quizQuestions = useStore((state) => state.routine.skinTypeQuestions);
  const token = localStorage.getItem("token");

  const scrollToTop = () => {
    if (skinRef.current) {
      skinRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      let skinTestIdActive = 1;
      const skinTestsData = await getAllSkinTests(token);
      if (skinTestsData && skinTestsData.$values.length > 0) {
        skinTestIdActive = skinTestsData.$values.find(
          (item) => item.status === true
        ).skinTestId;
      }
      await fetchQuestionsSkinTest(skinTestIdActive);
      setLoading(false);
    };
    loadQuestions();
  }, []);

  const validationSchema = Yup.object(
    (quizQuestions || []).reduce((schema, _, index) => {
      schema[`q${index}`] = Yup.array()
        .min(1, "Please select at least one option")
        .required("This question is required");
      return schema;
    }, {})
  );

  const formik = useFormik({
    initialValues: (quizQuestions || []).reduce((values, _, index) => {
      values[`q${index}`] = [];
      return values;
    }, {}),
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log("values", values);
      setStep(2);
      scrollToTop();
      const valuesArray = Object.values(values).flatMap((ans) => ans);
      if (valuesArray.length > 0) {
        await determineSkinType(valuesArray.map((ans) => parseInt(ans)));
        navigate("/quiz-result");
      }
    },
  });
  
  const answeredQuestions = Object.values(formik.values).filter(
    (val) => Array.isArray(val) && val.length > 0 // Kiểm tra nếu mảng không rỗng
  ).length;
  const totalQuestions = quizQuestions ? quizQuestions.length : 0;
  const progress =
    totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  return (
    <>
      <div
        className="quiz-page"
        style={{ backgroundColor: step === 3 ? "white" : "" }}
        ref={skinRef}
      >
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          step === 1 && (
            <div className="quiz-test-container">
              <Box maxWidth="600px" mx="auto" mt={4} p={2}>
                <Typography variant="h4" align="center" gutterBottom>
                  Skin Type Quiz
                </Typography>

                <Box mt={2} mb={3}>
                  <Typography variant="body1" align="center">
                    Progress: {answeredQuestions} / {quizQuestions.length}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{ height: 8, borderRadius: 5 }}
                  />
                </Box>

                <form onSubmit={formik.handleSubmit}>
                  {quizQuestions.map((q, index) => (
                    <Card key={index} sx={{ mb: 2, boxShadow: 3 }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {index + 1}. {q.question}
                        </Typography>
                        <FormControl
                          component="fieldset"
                          error={
                            formik.touched[`q${index}`] &&
                            Boolean(formik.errors[`q${index}`])
                          }
                        >
                          {q.options.map((value) =>
                            Object.entries(value).map(([key, label]) => (
                              <FormControlLabel
                                key={key}
                                control={
                                  <Checkbox
                                    checked={formik.values[
                                      `q${index}`
                                    ].includes(key)}
                                    onChange={(e) => {
                                      const selectedOptions = [
                                        ...formik.values[`q${index}`],
                                      ];
                                      if (e.target.checked) {
                                        selectedOptions.push(key);
                                      } else {
                                        selectedOptions.splice(
                                          selectedOptions.indexOf(key),
                                          1
                                        );
                                      }
                                      formik.setFieldValue(
                                        `q${index}`,
                                        selectedOptions
                                      );
                                    }}
                                  />
                                }
                                label={label}
                              />
                            ))
                          )}
                          <FormHelperText>
                            {formik.touched[`q${index}`] &&
                              formik.errors[`q${index}`]}
                          </FormHelperText>
                        </FormControl>
                      </CardContent>
                    </Card>
                  ))}

                  <Box mt={2} display="flex" justifyContent="center">
                    <Button
                      sx={{ color: "#fff" }}
                      type="submit"
                      variant="contained"
                      color="primary"
                    >
                      Submit Quiz
                    </Button>
                  </Box>
                </form>
              </Box>
            </div>
          )
        )}

        {step === 2 && (
          <div className="loading-quiz-result">
            Preparing scientific recommendations...
            <img src="/loading-quiz-result.svg" alt="" />
          </div>
        )}
      </div>
    </>
  );
};

export default SkinTestQuiz;
