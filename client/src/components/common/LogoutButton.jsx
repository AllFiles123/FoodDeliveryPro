import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

export default function LogoutButton() {
  const { logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login");
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="
        rounded-2xl
        bg-gradient-to-r
        from-red-500
        to-orange-500
        px-6
        py-3
        font-semibold
        text-white
        shadow-lg
        transition-all
        duration-300
        hover:scale-105
      "
    >
      Logout
    </button>
  );
}
