import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/SideBar";
import { Box } from "@mui/material";
import HeaderAdmin from "../components/header/HeaderAdmin";

const AdminLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const handlePageChange = (pageTitle: string) => {
    setCurrentPage(pageTitle);
  };

  return (
    <Box display="flex" height="100vh">
      <Sidebar onPageChange={handlePageChange} />
      <Box component="main" flex={1} p={3} sx={{ overflowY: "auto" }}>
        <HeaderAdmin currentPage={currentPage} />
        <Outlet /> {/* Render các trang con */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
