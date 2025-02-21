import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Button, CardActions, Typography } from "@mui/material";

export default function CreateSkin() {
  const [value, setValue] = React.useState("true");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fce4ec", // Nền hồng pastel
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
          border: "2px solid #a74d7b", // Viền màu hồng đậm hơn
        }}
      >
        {/* Tiêu đề */}
        <Typography variant="h5" align="center" sx={{ fontWeight: "bold", marginBottom: 2 }}>
          Tạo Bài Kiểm Tra Da
        </Typography>

        {/* Tên bài kiểm tra */}
        <TextField
          fullWidth
          label="Tên bài kiểm tra"
          id="fullWidth"
          multiline
          minRows={3}
          sx={{
            marginBottom: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e91e63" },
              "&:hover fieldset": { borderColor: "#d81b60" },
              "&.Mui-focused fieldset": { borderColor: "#d81b60", borderWidth: 2 },
            },
          }}
        />

        {/* Trạng thái */}
        <FormLabel id="demo-controlled-radio-buttons-group" sx={{ fontWeight: "bold", marginBottom: 1 }}>
          Trạng thái
        </FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={handleChange}
          sx={{ marginBottom: 2, justifyContent: "center" }}
        >
          <FormControlLabel value="true" control={<Radio />} label="Hoạt động" />
          <FormControlLabel value="fail" control={<Radio />} label="Ngừng hoạt động" />
        </RadioGroup>

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
            Thêm
          </Button>
        </CardActions>
      </FormControl>
    </Box>
  );
}
