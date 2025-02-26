import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Loading from "./components/loading/Loading";
import { useStore } from "./store";
import { useMemo, useEffect } from "react";
import CreateSkinTests from "./pages/admin/skin-test/CreateSkinTest"; // Đổi đường dẫn
import AdminLayout from "./layouts/AdminLayout";
import OrderPage from "./pages/checkout/Checkout";
import CreateSkinQuestion from "./pages/UpdateSkinTest";
import ListSkinTest from "./pages/admin/skin-test/ListSkinTest";
import SkinTestDetail from "./pages/admin/skin-test/SkinTestDetail"; // Import SkinTestDetail
import StaffLayout from "./layouts/StaffLayout";
import ProductManagement from "./pages/staff/product/ProductManagement";
import OrderManagement from "./pages/staff/order/OrderManagement";
import CategoryManagement from "./pages/staff/category/CategoryManagement";
import DashboardAdmin from "./pages/admin/dashboard/DashboardAdmin";
import DashboardStaff from "./pages/staff/dashboard/DashboardStaff";
import SkinTestQuiz from "./pages/quiz/SkinTestQuiz";
import CustomerLayout from "./layouts/CustomerLayout";
import Checkout from "./pages/checkout/Checkout";
import SaleProducts from "./pages/product/SaleProducts";
import ProductList from "./pages/product/ProductList";
import ProductDetail from './pages/product/ProductDetail';

function App() {
  const user = useStore((state) => state.profile.user);
  const role = useMemo(() => user?.role || localStorage.getItem("role"), [user]);
  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    console.log("App Auth State:", {
      user,
      role,
      isAuthenticated
    });
  }, [user, role, isAuthenticated]);

  const router = createBrowserRouter([
    { 
      path: "login", 
      element: <Login /> 
    },
    {
      path: "",
      element: <CustomerLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "take-quiz", element: <SkinTestQuiz /> },
        { path: "products", element: <ProductList /> },
        { path: "product/:id", element: <ProductDetail /> },
        { path: "for-sales", element: <SaleProducts /> },
        {
          path: "checkout",
          element: (
            <ProtectedRoute isAllowed={isAuthenticated && role === "Customer"} redirectPath="/login">
              <Checkout />
            </ProtectedRoute>
          )
        },
      ],
    },
    {
      path: "admin",
      element: (
        <ProtectedRoute isAllowed={isAuthenticated && role === "Manager"} redirectPath="/">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <DashboardAdmin /> },
        { path: "createskintest", element: <CreateSkinTests /> },
        { path: "skintests", element: <ListSkinTest /> },
        { path: "routines", element: <OrderPage /> },
        { path: "updateskintest", element: <CreateSkinQuestion /> },
        { path: "skintest/:id", element: <SkinTestDetail /> },
      ],
      errorElement: <Navigate to="/" replace />
    }, 
    {
      path: "staff",
      element: (
        <ProtectedRoute isAllowed={isAuthenticated && role === "Staff"} redirectPath="/">
          <StaffLayout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <DashboardStaff /> },
        { 
          path: "orders", 
          element: (
            <ProtectedRoute isAllowed={isAuthenticated && role === "Staff"} redirectPath="/staff/dashboard">
              <OrderManagement />
            </ProtectedRoute>
          )
        },
        { path: "categories", element: <CategoryManagement /> },
        { path: "products", element: <ProductManagement /> },
      ],
      errorElement: <Navigate to="/" replace />
    },
    {
      path: "*",
      element: <Navigate to="/" replace />
    }
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <Loading />
    </ThemeProvider>
  );
}

export default App;
