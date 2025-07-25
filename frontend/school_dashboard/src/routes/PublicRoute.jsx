import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PublicRoute = ({ children }) => {
  const { isLoggedIn, authLoading } = useContext(AppContext);

  if (authLoading) return null;

  return isLoggedIn ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
