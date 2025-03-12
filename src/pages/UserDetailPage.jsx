import * as React from "react";
import Card from "@mui/material/Card";

import CardMedia from "@mui/material/CardMedia";

const UserInfo = () => {
  const userData = {
    account: "Bemeonhomituot",
    password: "abc123",
    name: "Nguyen Van A",
    phone: "0987 654 321",
    email: "abc123@gmail.com",
    address: "67, Đường số 8, Phường Trảng Dài, TP Biên Hòa, Tỉnh Đồng Nai",
    dateOfJoining: "06/25/2022",
  };

  return (
    <div style={styles.wrapper}>
      {/* Ảnh đại diện */}
      <Card sx={{ width: 200, flexShrink: 0 }}>
        <CardMedia
          component="img"
          alt="User Avatar"
          image="https://voguesg.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2024/04/19204343/banner-queenoftears-kimjiwon-680x1020.jpg"
        />
      </Card>

      <div style={styles.container}>
        <FormRow label="Account :" value={userData.account} />
        <FormRow label="Password :" value={userData.password} type="password" />
        <FormRow label="Name :" value={userData.name} />
        <FormRow label="Phone number :" value={userData.phone} />
        <FormRow label="Email :" value={userData.email} />
        <FormRow label="Address :" value={userData.address} />
        <FormRow label="Date of joining :" value={userData.dateOfJoining} />
      </div>
    </div>
  );
};

const FormRow = ({ label, value, type = "text" }) => (
  <div style={styles.formGroup}>
    <label style={styles.label}>{label}</label>
    <input style={styles.input} type={type} value={value} readOnly />
  </div>
);

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "flex-start",
    gap: "20px",
    padding: "20px",
    justifyContent: "center",
  },
  container: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    width: "500px",
  },
  formGroup: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },
  label: {
    width: "150px",
    fontWeight: "bold",
  },
  input: {
    flex: 1,
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    backgroundColor: "#f3f3f3",
  },
};

export default UserInfo;
