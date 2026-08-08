import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    const setupCompleted =
      localStorage.getItem("setupCompleted") === "true";

    if (!setupCompleted) {
      return (
        <Navigate
          to="/language"
          replace
        />
      );
    }

    return (
      <Navigate
        to="/home"
        replace
      />
    );
  }

  return children;
}
