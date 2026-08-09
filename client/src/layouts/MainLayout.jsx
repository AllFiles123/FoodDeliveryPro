import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";
import FloatingCart from "../components/FloatingCart/FloatingCart";

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

  const filterIsOpen =
    typeof document !== "undefined" &&
    document.body.classList.contains("filter-open");

  return (
    <div className="min-h-screen overflow-hidden bg-[#fffaf5]">
      <Outlet />

      {/* GLOBAL FLOATING CART */}
      <FloatingCart />

      {!hideBottomNavigation && !filterIsOpen && (
        <BottomNavigation />
      )}
    </div>
  );
}
