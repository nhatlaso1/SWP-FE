import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import * as Yup from "yup";

import { useStore } from "../../store";

import "./Header.scss";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);

  const changePassword = useStore((store) => store.changePassword);

  const token = localStorage.getItem("token");
  const openMenu = Boolean(anchorEl);
  const role = localStorage.getItem("role");

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const navigate = useNavigate();
  const logout = useStore((store) => store.logout);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .required("New password is required")
        .min(6, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .required("Please confirm your new password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match"),
    }),
    onSubmit: (values) => {
      changePassword(values.oldPassword, values.newPassword);
    },
  });

  return (
    <>
      <nav className={`header ${visible ? "visible" : "hidden"}`}>
        <div className="branch-wrap" onClick={() => navigate("/")}>
          <img src="/beauty-logo.svg" alt="" />
          <h4>BEAUTYSC</h4>
        </div>

        <div className="nav-wrap">
          <a href="">Home</a>
          <a href="">Voucher</a>
          <a href="">For Sales</a>
          <a href="">Products</a>
          <a href="/take-quiz">Quiz Skin Q&A</a>
          {/* <a href={token ? "/take-quiz" : "login"}>Quiz Skin Q&A</a> */}
        </div>

        <div className="searchbar-wrap">
          <SearchOutlinedIcon />|
          <div>
            <img src="" alt="" />
            US <span>(EN)</span>
          </div>
          <Button variant="text" href="/login">
            Login
          </Button>
        </div>
      </nav>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <form
            onSubmit={formik.handleSubmit}
            style={{ maxWidth: "400px", margin: "0 auto" }}
          >
            <TextField
              fullWidth
              id="oldPassword"
              name="oldPassword"
              label="Old Password"
              type="password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
              }
              helperText={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
              margin="normal"
            />
            <TextField
              fullWidth
              id="newPassword"
              name="newPassword"
              label="New Password"
              type="password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
              margin="normal"
            />
            <TextField
              fullWidth
              id="confirmPassword"
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
              margin="normal"
            />
            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
            >
              Change Password
            </Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="info">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
