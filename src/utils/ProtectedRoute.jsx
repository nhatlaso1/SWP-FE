import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAllowed, redirectPath = "/login" }) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} />;
  }

  return children;
};

export default ProtectedRoute;
