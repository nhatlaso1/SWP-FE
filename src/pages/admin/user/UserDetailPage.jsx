import * as React from "react";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

const UserInfo = () => {
  // Lấy id từ URL, ví dụ URL có dạng /user/123
  const { id } = useParams();
  console.log("User id from URL:", id);

  // Ví dụ: nếu có id, bạn có thể fetch dữ liệu người dùng từ API ở đây.
  // Hiện tại, ta sử dụng dữ liệu tĩnh dưới đây.
  const userData = {
    account: "Bemeonhomituot",
    password: "abc123",
    name: "Nguyen Van A",
    phone: "0987 654 321",
    email: "abc123@gmail.com",
    address: "67, Đường số 8, Phường Trảng Dài, TP Biên Hòa, Tỉnh Đồng Nai",
    dateOfJoining: "06/25/2022",
  };

  // Mảng cấu hình các trường hiển thị (dễ dàng mapping trong tương lai)
  const fields = [
    { key: "account", label: "Account:" },
    { key: "password", label: "Password:", type: "password" },
    { key: "name", label: "Name:" },
    { key: "phone", label: "Phone Number:" },
    { key: "email", label: "Email:" },
    { key: "address", label: "Address:" },
    { key: "dateOfJoining", label: "Date of Joining:" },
  ];

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
        {fields.map(({ key, label, type = "text" }) => (
          <FormRow key={key} label={label} value={userData[key]} type={type} />
        ))}
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
