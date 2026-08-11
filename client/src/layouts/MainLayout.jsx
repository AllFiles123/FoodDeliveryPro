import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";

export default function MainLayout() {
  const location = useLocation();

  const path = location.pathname;

  const isFoodDetailsPage =
    path.startsWith("/food/") ||
    path.startsWith("/foods/") ||
    path.startsWith("/food-details/") ||
    path.startsWith("/fooddetails/");

  const hideBottomNavigation =
    path === "/profile/details" ||
    path === "/profile/payment" ||
    path === "/checkout" ||
    path === "/explore-reels" ||
    isFoodDetailsPage;

  const filterOpen =
    typeof document !== "undefined" &&
    document.body.classList.contains("filter-open");

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br
        from-background
        via-background
        to-background
        overflow-hidden
      "
    >
      <Outlet />

      {!hideBottomNavigation && !filterOpen && (
        <BottomNavigation />
      )}
    </div>
  );
}
