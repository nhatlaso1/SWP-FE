import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Loading from "./components/loading/Loading";
import { useStore } from "./store";
import { useMemo } from "react";
import CreateSkinTests from "./pages/admin/skin-test/CreateSkinTest"; // Đổi đường dẫn
import AdminLayout from "./layouts/AdminLayout";
import OrderPage from "./pages/OrderPage";
import CreateSkinQuestion from "./pages/UpdateSkinTest";
import ListSkinTest from "./pages/admin/skin-test/ListSkinTest";
import SkinTestDetail from "./pages/admin/skin-test/SkinTestDetail"; // Import SkinTestDetail
import StaffLayout from "./layouts/StaffLayout";
import ProductManagement from "./pages/staff/product/ProductManagement";
import OrderList from "./pages/staff/order/OrderList";
import CategoryManagement from "./pages/staff/category/CategoryManagement";
import DashboardAdmin from "./pages/admin/dashboard/DashboardAdmin";
import DashboardStaff from "./pages/staff/dashboard/DashboardStaff";
import SkinTestQuiz from "./pages/quiz/SkinTestQuiz";

function App() {
  const user = useStore((store) => store.profile.user);
  const role = useMemo(() => user?.role || localStorage.getItem("role"), [user]);
  const isAuthenticated = !!localStorage.getItem("token");

  const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "login", element: <Login /> },
    { path: "take-quiz", element: <SkinTestQuiz /> },
    {
      path: "admin",
      element: (
        <ProtectedRoute isAllowed={isAuthenticated && role === "Manager"} redirectPath="/">
          <AdminLayout /> 
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <DashboardAdmin /> },
        { path: "createskintest", element: <CreateSkinTests /> },
        { path: "skintests", element: <ListSkinTest /> },
        { path: "routines", element: <OrderPage /> },
        { path: "updateskintest", element: <CreateSkinQuestion /> },
        { path: "skintest/:id", element: <SkinTestDetail /> }, 
      ],
    },{
      path: "staff",
      element: (
        <ProtectedRoute isAllowed={isAuthenticated && role === "Staff"} redirectPath="/">
          <StaffLayout /> 
        </ProtectedRoute>
      ),
      children: [
        { path: "dashboard", element: <DashboardStaff /> },
        { path: "orders", element: <OrderList /> },
        { path: "categories", element: <CategoryManagement /> },
        { path: "products", element: <ProductManagement /> }, // Thêm route chi tiết SkinTest
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
