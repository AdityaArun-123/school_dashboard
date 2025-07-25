import { useContext, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "./context/AppContext";
import AppRoutes from "./routes/AppRoutes";
import { Spinner } from "./components/spinner/Spinner";

function App() {
  const { authLoading, isLoggedIn } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const manualEntryRef = useRef(false);

  useEffect(() => {
    const navEntry = window.performance.getEntriesByType("navigation")[0];
    manualEntryRef.current = navEntry?.type === "navigate" || navEntry?.type === "reload";
  }, []);

  useEffect(() => {
    if (authLoading) return;

    const currentPath = location.pathname;
    const state = location.state;
    const isInternalNav = state?.internalNav === true;

    const publicRoutes = ["/log-in", "/sign-up"];
    const conditionalPublicRoutes = [
      "/verify-email", "/forget-password", "/change-password"
    ];

    if (!isLoggedIn) {
      if (publicRoutes.includes(currentPath)) {
        return;
      } else if (conditionalPublicRoutes.includes(currentPath)) {
        if (manualEntryRef.current && !isInternalNav) {
          navigate("/log-in", { replace: true });
        }
      } else {
        navigate("/log-in", { replace: true });
      }
    } else {
      if (publicRoutes.includes(currentPath)) {
        navigate("/", { replace: true });
      }
    }
  }, [authLoading, isLoggedIn, location.pathname, location.state, navigate]);

  if (authLoading) {
    return <Spinner />
  }

  return <AppRoutes />;
}

export default App;