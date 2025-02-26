import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./theme";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Loading from "./components/loading/Loading";
import { useStore } from "./store";
import { useMemo, useEffect } from "react";
import CreateSkinTests from "./pages/admin/skin-test/CreateSkinTest";
import AdminLayout from "./layouts/AdminLayout";
import OrderPage from "./pages/checkout/Checkout";
import CreateSkinQuestion from "./pages/UpdateSkinTest";
import ListSkinTest from "./pages/admin/skin-test/ListSkinTest";
import SkinTestDetail from "./pages/admin/skin-test/SkinTestDetail";
import StaffLayout from "./layouts/StaffLayout";
import ProductManagement from "./pages/staff/product/ProductManagement";
import OrderList from "./pages/staff/order/OrderList";
import CategoryManagement from "./pages/staff/category/CategoryManagement";
import DashboardAdmin from "./pages/admin/dashboard/DashboardAdmin";
import DashboardStaff from "./pages/staff/dashboard/DashboardStaff";
import SkinTestQuiz from "./pages/quiz/SkinTestQuiz";
import CustomerLayout from "./layouts/CustomerLayout";
import Checkout from "./pages/checkout/Checkout";
import ProductList from "./pages/product/ProductList";
import SaleProducts from "./pages/product/SaleProducts";
import ProductDetail from "./pages/product/ProductDetail";
import Register from "./pages/register/Register";
import CheckoutSuccess from "./pages/checkout/CheckoutSuccess";

function App() {
  const user = useStore((store) => store.profile.user);
  const token = localStorage.getItem("token");
  const role = useMemo(() => {
    if (user?.role) return user.role;
    if (token) return localStorage.getItem("role");
    return null;
  }, [user, token]);

  const isAuthenticated = !!localStorage.getItem("token");

  // Log role mỗi lần user hoặc role thay đổi
  useEffect(() => {
    console.log("User:", user);
    console.log("Token:", token);
    console.log("Role:", role);
  }, [user, token, role]);

  const router = createBrowserRouter([
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    {
      path: "",
      element: <CustomerLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "take-quiz", element: <SkinTestQuiz /> },
        { path: "products", element: <ProductList /> },
        { path: "product/:id", element: <ProductDetail /> },
        { path: "sales", element: <SaleProducts /> },
        { path: "success", element: <CheckoutSuccess /> },
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
        { path: "dashboard", element: <DashboardAdmin /> },
        { path: "createskintest", element: <CreateSkinTests /> },
        { path: "skintests", element: <ListSkinTest /> },
        { path: "routines", element: <OrderPage /> },
        { path: "updateskintest", element: <CreateSkinQuestion /> },
        { path: "skintest/:id", element: <SkinTestDetail /> },
      ],
    }, {
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
        { path: "products", element: <ProductManagement /> },
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
