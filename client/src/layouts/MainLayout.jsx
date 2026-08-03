import { Outlet, useLocation } from "react-router-dom";

import BottomNavigation from "../components/BottomNavigation/BottomNavigation";


export default function MainLayout() {


  const location = useLocation();



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


  );




  return (

    <div className="min-h-screen bg-[#F8FAFC] pb-24">


      <Outlet />



      {
        showBottomNavigation && (

          <BottomNavigation />

        )
      }


    </div>

  );


}
