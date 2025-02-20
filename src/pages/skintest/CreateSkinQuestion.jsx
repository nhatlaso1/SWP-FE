import * as React from "react";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {
  Box,
  Button,
  CardActions,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

export default function CreateSkinQuestion() {
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fce4ec", // Màu nền pastel hồng nhạt
        padding: 2,
      }}
    >
      <FormControl
        sx={{
          maxWidth: 500,
          width: "100%",
          padding: 4,
          backgroundColor: "white",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)", // Đổ bóng mềm mại
          borderRadius: 3,
        }}
      >
        {/* Tiêu đề */}
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", marginBottom: 2 }}
        >
          Tạo Câu Hỏi Kiểm Tra Da
        </Typography>

        {/* Câu hỏi */}
        <TextField
          fullWidth
          label="Câu hỏi kiểm tra"
          id="fullWidth"
          multiline
          minRows={3}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e91e63" },
              "&:hover fieldset": { borderColor: "#d81b60" },
              "&.Mui-focused fieldset": {
                borderColor: "#d81b60",
                borderWidth: 2,
              },
            },
          }}
        />

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="demo-simple-select-label">
            Tên bài kiểm tra
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={age}
            label="Tên bài kiểm tra"
            onChange={handleChange}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e91e63" },
                "&:hover fieldset": { borderColor: "#d81b60" },
                "&.Mui-focused fieldset": {
                  borderColor: "#d81b60",
                  borderWidth: 2,
                },
              },
            }}
          >
            <MenuItem value={10}>Kiểm tra loại da</MenuItem>
            <MenuItem value={20}>Kiểm tra độ ẩm da</MenuItem>
          </Select>
        </FormControl>

        {/* Nút thêm */}
        <CardActions sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            size="large"
            sx={{
              backgroundColor: "#e91e63",
              color: "white",
              boxShadow: "0px 4px 10px rgba(180, 96, 124, 0.5)",
              "&:hover": {
                backgroundColor: "#d81b60",
                boxShadow: "0px 6px 12px rgba(178, 104, 129, 0.7)",
              },
              borderRadius: 3,
              paddingX: 4,
              fontWeight: "bold",
            }}
          >
            Thêm Câu Hỏi
          </Button>
        </CardActions>
      </FormControl>
    </Box>
  );
}
