import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  /*
   * ProtectedRoute-এর একমাত্র কাজ:
   * user login করেছে কি না সেটা check করা।
   *
   * এখানে Language / Location / setupCompleted
   * কোনো check করা হবে না।
   *
   * কারণ first-login flow:
   *
   * Login
   *   ↓
   * Language
   *   ↓
   * Location
   *   ↓
   * Home
   */

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

  return children;
}
