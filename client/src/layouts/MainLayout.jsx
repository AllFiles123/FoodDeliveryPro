import { Outlet, useLocation } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation/BottomNavigation";

export default function MainLayout(){

  const location = useLocation();


  const hideBottomNavigation =
    location.pathname === "/profile/details" ||
    location.pathname === "/profile/payment";


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

      {
        !hideBottomNavigation &&
        !document.body.classList.contains("filter-open") &&
        <BottomNavigation/>
      }

    </div>

  );

}
