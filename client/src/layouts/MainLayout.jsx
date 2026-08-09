import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";

export default function MainLayout() {
  const location = useLocation();

  const hideBottomNavigation = [
    "/",
    "/language",
    "/cart",
    "/onboarding",
    "/login",
    "/signup",
    "/forgot-password",
    "/otp",
    "/reset-password",
    "/location",
    "/profile/details",
    "/profile/payment",
  ].includes(location.pathname);

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffaf5]">

      <Outlet />

      {!hideBottomNavigation &&
        !document.body.classList.contains("filter-open") && (
          <BottomNavigation />
        )}

    </div>
  );
}
