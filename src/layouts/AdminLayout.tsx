import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/SideBar";
import { Box } from "@mui/material"; // Dùng Box để quản lý layout tốt hơn

const AdminLayout: React.FC = () => {
  return (
    <Box display="flex" height="100vh">
      <Sidebar />
      <Box component="main" flex={1} p={3} sx={{ overflowY: "auto" }}>
        <Outlet /> {/* Render các trang con */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
