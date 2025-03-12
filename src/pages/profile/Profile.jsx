import React, { useEffect } from "react";
import { Avatar, Button, TextField } from "@mui/material";
import { useFormik } from "formik";

import { useStore } from "../../store";

import "./Profile.scss";

const Profile = () => {
  const fetchProfile = useStore((store) => store.fetchProfile);
  const updateProfile = useStore((store) => store.updateProfile);
  const profile = useStore((store) => store.profile.userProfile);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      birthday: "",
      phoneNumber: "",
      skinType: {
        skinTypeName: "",
      },
    },
    onSubmit: async (values) => {
      await updateProfile(values);
      await fetchProfile();
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      formik.setValues(profile);
    }
  }, [profile]);

  return (
    <>
      <div className="profile-page">
        <div className="profile-container">
          <h1>Profile detail</h1>

          <form
            onSubmit={formik.handleSubmit}
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div className="avatar-wrap">
              <Avatar>
                {formik.values.fullName.slice(0, 1).toUpperCase()}
              </Avatar>
            </div>

            <TextField
              fullWidth
              id="fullName"
              name="fullName"
              label="Full name"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="birthday"
              name="birthday"
              label="Birthday"
              value={formik.values.birthday}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.birthday && Boolean(formik.errors.birthday)}
              helperText={formik.touched.birthday && formik.errors.birthday}
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="skinTypeName"
              name="skinTypeName"
              label="Skin Type Name"
              value={formik.values.skinType?.skinTypeName}
              disabled={true}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.skinType?.skinTypeName &&
                Boolean(formik.errors.skinType?.skinTypeName)
              }
              helperText={
                formik.touched.skinType?.skinTypeName &&
                formik.errors.skinType?.skinTypeName
              }
              style={{ marginBottom: "16px" }}
            />

            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px", color: "white" }}
            >
              Edit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
