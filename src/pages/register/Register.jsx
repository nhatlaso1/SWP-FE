import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useStore } from "../../store";

import "./Register.scss";

const Register = () => {
  const navigate = useNavigate();
  const onRegister = useStore((store) => store.register);
  const error = useStore((store) => store.profile.error);

  const minValidBirthday = new Date();
  minValidBirthday.setFullYear(minValidBirthday.getFullYear() - 18);
  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      birthday: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      birthday: Yup.date()
        .required("Birthday is required")
        .max(minValidBirthday, "You must be at least 18 years old"),
      phoneNumber: Yup.string()
        .matches(/^\d+$/, "Invalid phone number")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      await onRegister(values);
      if (error === false) {
        navigate("/login");
      }
    },
  });

  return (
    <div className="register-page">
      <img className="bg-register" src="login-bg.svg" alt="bg-register" />
      <div className="register-container">
        <img
          className="logo"
          src="/beauty-logo.svg"
          alt="logo"
          onClick={() => navigate("/")}
          style={{ marginBottom: "12px" }}
        />

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="fullName"
            name="fullName"
            placeholder="Full Name"
            variant="outlined"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && Boolean(formik.errors.fullName)}
            helperText={formik.touched.fullName && formik.errors.fullName}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            id="email"
            name="email"
            placeholder="Email"
            variant="outlined"
            style={{ marginTop: "16px" }}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            variant="outlined"
            style={{ marginTop: "16px" }}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            id="birthday"
            name="birthday"
            type="date"
            variant="outlined"
            style={{ marginTop: "16px" }}
            value={formik.values.birthday}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.birthday && Boolean(formik.errors.birthday)}
            helperText={formik.touched.birthday && formik.errors.birthday}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Phone Number"
            variant="outlined"
            style={{ marginTop: "16px" }}
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
            }
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon />
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <div style={{ marginTop: "16px" }}>
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            style={{ marginTop: "16px", color: "white" }}
          >
            Register
          </Button>
        </form>

        <div className="login-link">
          <p>Already have an account?</p>
          <Button
            color="primary"
            variant="text"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
