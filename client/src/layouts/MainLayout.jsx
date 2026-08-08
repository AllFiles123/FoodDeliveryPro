import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";

export default function MainLayout() {
  const location = useLocation();

  /*
   * Full-screen pages where bottom navigation
   * should never appear.
   */
  const hideBottomNavigation =
    location.pathname.startsWith("/checkout") ||
    location.pathname.startsWith("/profile/details") ||
    location.pathname.startsWith("/profile/payment");

  /*
   * Filter sheets / fullscreen overlays can
   * temporarily hide the bottom navigation.
   */
  const filterIsOpen =
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
      "
    >
      <Outlet />

      {!hideBottomNavigation && !filterIsOpen && (
        <BottomNavigation />
      )}
    </div>
  );
}
