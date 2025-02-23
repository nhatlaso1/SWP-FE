import {
  HashRouter as Router,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { useMemo } from "react";

import { useStore } from "./store";
import theme from "./theme";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import ProtectedRoute from "./utils/ProtectedRoute";
import Loading from "./components/loading/Loading";
import SkinTestQuiz from "./pages/quiz/SkinTestQuiz";
import Notification from "./components/notification/Notification";

import "./App.css";

function App() {
  const user = useStore((store) => store.profile.user);

  const role = useMemo(() => {
    return user?.role || localStorage.getItem("role");
  }, [user]);

  const isAuthenticated = !!localStorage.getItem("token");

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "take-quiz",
      element: <SkinTestQuiz />,
    },
    {
      path: "admin/dashboard",
      element: (
        <ProtectedRoute
          isAllowed={
            isAuthenticated &&
            (role === "ROLE_VOLUNTEER" || role === "ROLE_ADMIN")
          }
          redirectPath="/"
        >
          <p></p>
          {/* <Dashboard /> */}
        </ProtectedRoute>
      ),
    },
  ]);

  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
      <Loading />
      <Notification />
    </ThemeProvider>
  );
}

export default App;
