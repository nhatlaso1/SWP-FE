import React, { useState } from "react";
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
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";

import "./SkinTestQuiz.scss";

const quizQuestions = [
  {
    question: "How does your skin feel after washing your face?",
    options: {
      a: "Tight & dry",
      b: "Balanced",
      c: "Oily",
      d: "Sensitive & red",
    },
    correctAnswer: "b",
  },
  {
    question: "How often do you experience breakouts?",
    options: {
      a: "Rarely",
      b: "Occasionally",
      c: "Frequently",
      d: "Almost never",
    },
    correctAnswer: "c",
  },
  {
    question: "What happens when you apply moisturizer?",
    options: {
      a: "Feels greasy",
      b: "Feels hydrated",
      c: "No effect",
      d: "Irritates my skin",
    },
    correctAnswer: "b",
  },
  {
    question: "How would you describe your pores?",
    options: {
      a: "Small & invisible",
      b: "Medium & normal",
      c: "Large & visible",
      d: "Red & inflamed",
    },
    correctAnswer: "b",
  },
  {
    question: "Does your skin get shiny throughout the day?",
    options: {
      a: "Never",
      b: "Slightly",
      c: "Yes, very shiny",
      d: "Only on my T-zone",
    },
    correctAnswer: "c",
  },
  {
    question: "How does your skin react to new skincare products?",
    options: {
      a: "Gets irritated",
      b: "Feels fine",
      c: "Becomes more oily",
      d: "Feels dry",
    },
    correctAnswer: "b",
  },
  {
    question: "Do you have visible redness on your face?",
    options: { a: "Yes, a lot", b: "Sometimes", c: "Rarely", d: "Never" },
    correctAnswer: "b",
  },
  {
    question: "What best describes your skin texture?",
    options: {
      a: "Smooth",
      b: "Slightly rough",
      c: "Very uneven",
      d: "Dry patches",
    },
    correctAnswer: "a",
  },
  {
    question: "How does your skin feel in cold weather?",
    options: { a: "Very dry", b: "Normal", c: "Oily", d: "Sensitive" },
    correctAnswer: "b",
  },
  {
    question: "How does your skin feel at the end of the day?",
    options: {
      a: "Dry & flaky",
      b: "Normal",
      c: "Very oily",
      d: "Tight & irritated",
    },
    correctAnswer: "b",
  },
];

const validationSchema = Yup.object().shape(
  quizQuestions.reduce((schema, _, index) => {
    schema[`q${index}`] = Yup.string().required("This question is required");
    return schema;
  }, {})
);

const SkinTestQuiz = () => {
  const [score, setScore] = useState(null);

  const formik = useFormik({
    initialValues: quizQuestions.reduce((values, _, index) => {
      values[`q${index}`] = "";
      return values;
    }, {}),
    validationSchema,
    onSubmit: (values) => {
      let correctAnswers = 0;
      quizQuestions.forEach((q, index) => {
        if (values[`q${index}`] === q.correctAnswer) {
          correctAnswers++;
        }
      });
      setScore(correctAnswers);
    },
  });

  const answeredQuestions = Object.values(formik.values).filter(
    (val) => val !== ""
  ).length;
  const progress = (answeredQuestions / quizQuestions.length) * 100;

  return (
    <Box maxWidth="600px" mx="auto" mt={4} p={2}>
      <Typography variant="h4" align="center" gutterBottom>
        Skin Type Quiz
      </Typography>

      {/* Progress Bar */}
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
                <RadioGroup
                  name={`q${index}`}
                  value={formik.values[`q${index}`]}
                  onChange={formik.handleChange}
                >
                  {Object.entries(q.options).map(([key, value]) => (
                    <FormControlLabel
                      key={key}
                      value={key}
                      control={<Radio />}
                      label={`${key}: ${value}`}
                    />
                  ))}
                </RadioGroup>
                <FormHelperText>
                  {formik.touched[`q${index}`] && formik.errors[`q${index}`]}
                </FormHelperText>
              </FormControl>
            </CardContent>
          </Card>
        ))}

        <Box mt={2} display="flex" justifyContent="center">
          <Button type="submit" variant="contained" color="primary">
            Submit Quiz
          </Button>
        </Box>
      </form>

      {score !== null && (
        <Box mt={3} textAlign="center">
          <Typography variant="h5">
            You got {score} / {quizQuestions.length} correct!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default SkinTestQuiz;
