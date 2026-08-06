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
      from-[#FDE7E7]
      via-[#FFF3E0]
      to-[#E7F5E9]
      overflow-hidden
      "
    >

      <Outlet />

      {
        !hideBottomNavigation &&
        <BottomNavigation/>
      }

    </div>

  );

}
