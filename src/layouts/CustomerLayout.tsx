import React from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import HeaderCustomer from "../components/header/HeaderCustomer";
import Footer from "../components/footer/Footer";
import { useStore } from "../store";
import HeaderGuest from "../components/header/HeaderGuest";

const CustomerLayout: React.FC = () => {
  const user = useStore((store) => store.profile.user);
  const isAuthenticated = !!localStorage.getItem("token");
  const role = user?.role || "Guest";

  return (
    <Box component="main" flex={1} p={3} sx={{ overflowY: "auto" }}>
      {isAuthenticated && role === "Customer" ? <HeaderCustomer /> : <HeaderGuest />}
      <Outlet />
      <Footer />
    </Box>
  );
};

export default CustomerLayout;
