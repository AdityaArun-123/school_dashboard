import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useContext(AppContext);

  if (authLoading) return null;

  return isLoggedIn ? children : <Navigate to="/log-in" replace />;
};

export default ProtectedRoute;
