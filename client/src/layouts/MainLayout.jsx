import { Outlet, useLocation } from "react-router-dom";

import BottomNavigation from "../components/BottomNavigation/BottomNavigation";


export default function MainLayout() {


  const location = useLocation();



  const hideBottomNavigation = [

    "/profile/details",
    "/profile/payment"

  ].some((path)=>

    location.pathname.startsWith(path)

  );


const showBottomNavigation = [

    "/home",
    "/search",
    "/restaurants",
    "/cart",
    "/orders",
    "/profile",

  ].some((path)=>

    location.pathname === path ||

    location.pathname.startsWith(path + "/")

  ) && !hideBottomNavigation;




  return (

    <div
      className="
        min-h-screen
        pb-24
        bg-gradient-to-br
        from-[#FDE7E7]
        via-[#FFF3E0]
        to-[#E7F5E9]
        bg-fixed
        overflow-x-hidden
      "
    >


      <Outlet />



      {
        showBottomNavigation && (

          <BottomNavigation />

        )
      }


    </div>

  );


}
