import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";

const SkinTestCard = ({ skinTestData, skinTypes }) => {
  const renderSkinTestCard = () => (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5">{skinTestData.skinTestName}</Typography>
        <Typography variant="subtitle1">
          Status: {skinTestData.status ? "Active" : "Inactive"}
        </Typography>
        {renderQuestions()}
      </CardContent>
    </Card>
  );

  const renderQuestions = () =>
    skinTestData.questions.map((question, questionIndex) => (
      <Card
        key={questionIndex}
        variant="outlined"
        style={{ marginTop: "10px" }}
      >
        <CardContent>
          <Typography variant="h6">Question: {question.description}</Typography>
          {renderAnswers(question.answers)}
        </CardContent>
      </Card>
    ));

  const renderAnswers = (answers) =>
    answers.map((answer, answerIndex) => (
      <Card
        key={answerIndex}
        variant="outlined"
        style={{ marginTop: "10px", padding: "10px" }}
      >
        <Typography>Answer: {answer.description}</Typography>
        <Select value={answer.skinType || ""} displayEmpty>
          <MenuItem value="">Select skin type</MenuItem>
          {skinTypes.map((type) => (
            <MenuItem key={type.skinTypeId} value={type.skinTypeId}>
              {type.skinTypeName}
            </MenuItem>
          ))}
        </Select>
      </Card>
    ));

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {renderSkinTestCard()}
      </Grid>
    </Grid>
  );
};

export default SkinTestCard;
