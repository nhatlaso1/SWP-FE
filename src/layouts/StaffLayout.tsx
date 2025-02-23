import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import SidebarStaff from "../components/sidebar/SideBarStaff";
import HeaderStaff from "../components/header/HeaderStaff";

const StaffLayout: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const handlePageChange = (pageTitle: string) => {
    setCurrentPage(pageTitle);
  };

  return (
    <Box display="flex" height="100vh">
      <SidebarStaff onPageChange={handlePageChange} />
      <Box component="main" flex={1} p={3} sx={{ overflowY: "auto" }}>
        <HeaderStaff currentPage={currentPage} />
        <Outlet /> {/* Render các trang con */}
      </Box>
    </Box>
  );
};

export default StaffLayout;
