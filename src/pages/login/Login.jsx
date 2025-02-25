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

const Login = () => {
  const navigate = useNavigate();
  const onLogin = useStore((store) => store.login);
  const user = useStore((store) => store.profile.user);
  const error = useStore((store) => store.profile.error);
  const token = localStorage.getItem("token");

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      const { username, password } = values;
      await onLogin(username, password);
    },
  });

  useEffect(() => {
    if (error === false) {
      navigate("/");
    }
  }, [error, navigate]);

  useEffect(() => {
    if (user && user.role === 'Manager') {
      navigate("/dashboard");
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
        {/* <h4 className="title">Đăng nhập</h4> */}

        <form onSubmit={formik.handleSubmit}>
          <div>
            <TextField
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
              }}
              id="username"
              name="username"
              // label="Username"
              variant="outlined"
              placeholder="Username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
          </div>

          <div style={{ marginTop: "16px" }}>
            <TextField
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                },
              }}
              id="password"
              name="password"
              // label="Password"
              type="password"
              variant="outlined"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
          </div>
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
            Login
          </Button>
        </form>

        <div className="register">
          <Button
            color="primary"
            variant="text"
            onClick={() => navigate("/register")}
          >
            Register
          </Button>
        </div>

        <div className="sign-up-w-line">
          <span></span>
          <p>Or sign up with</p>
          <span></span>
        </div>

        <div className="other-login">
          <div className="login-item">
            <img src="/icons/fb-icon.svg" alt="fb" />
          </div>
          <div className="login-item">
            <img src="/icons/google-icon.svg" alt="google" />
          </div>
          <div className="login-item">
            <img src="/icons/apple-icon.svg" alt="apple" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
