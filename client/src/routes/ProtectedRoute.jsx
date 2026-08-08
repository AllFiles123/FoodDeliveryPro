import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  const setupDone =
    localStorage.getItem("initialSetupComplete") === "true";

  /*
   * First-login setup must happen before Home.
   */
  if (
    !setupDone &&
    location.pathname !== "/language" &&
    location.pathname !== "/location"
  ) {
    return (
      <Navigate
        to="/language"
        replace
      />
    );
  }

  return children;
}
