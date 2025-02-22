import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import theme from "./theme";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Loading from "./components/loading/Loading";
import { useStore } from "./store";
import { useMemo } from "react";
import DashboardPage from "./pages/admin//dashboard/Dashboard"; // Đổi đường dẫn
import CreateSkinTests from "./pages/admin/skin-test/SkinTest"; // Đổi đường dẫn
import AdminLayout from "./layouts/AdminLayout"; // Import layout Admin
import OrderPage from "./pages/OrderPage";
import CreateSkinQuestion from "./pages/UpdateSkinTest";
import ListSkinTest from "./pages/admin/skin-test/ListSkinTest";

function App() {
  const user = useStore((store) => store.profile.user);
  const role = useMemo(() => user?.role || localStorage.getItem("role"), [user]);
  const isAuthenticated = !!localStorage.getItem("token");

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "login", element: <Login /> },
    {
      path: "admin",
      element: (
        <ProtectedRoute isAllowed={isAuthenticated && role === "Manager"} redirectPath="/">
          <AdminLayout /> 
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <DashboardPage /> },
        { path: "skintest", element: <CreateSkinTests /> },
        { path: "allskintest", element: <ListSkinTest /> },
        { path: "orderpage", element: <OrderPage /> },
        { path: "updateskintest", element: <CreateSkinQuestion /> },
      ],
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <Loading />
    </ThemeProvider>
  );
}

export default App;
