import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useStore } from "../../store";
import "./Login.scss";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const onLogin = useStore((store) => store.login);
  const user = useStore((store) => store.profile.user);
  const setError = useStore((store) => store.setError);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await onLogin(values.email, values.password, navigate);
      } catch (error) {
        console.error("Login error:", error);
        setError("Invalid email or password");
      }
    },
  });

  useEffect(() => {
    if (user) {
      const { role } = user;
      if (role === "Manager") {
        navigate("/admin/dashboard");
      } else if (role === "ROLE_USER") {
        navigate("/");
      }
    }
  }, [user, navigate]);

  return (
    <div className="login-page">
      <img className="bg-login" src="login-bg.svg" alt="bg-login" />
      <div className="login-container">
        <img
          className="logo"
          src="/beauty-logo.svg"
          alt="logo"
          onClick={() => navigate("/")}
          style={{ marginBottom: "12px" }}
        />

        <form onSubmit={formik.handleSubmit}>
          <div>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
              id="email"
              name="email"
              placeholder="Email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </div>

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            style={{ marginTop: "16px", color: "white" }}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
