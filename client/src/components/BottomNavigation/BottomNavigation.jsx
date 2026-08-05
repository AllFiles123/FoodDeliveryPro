import { NavLink } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

import {
  House,
  Search,
  ShoppingCart,
  ClipboardList,
  User,
} from "lucide-react";

import { useCart } from "../../context/CartContext";


const menus = [
  {
    name: "Home",
    path: "/home",
    icon: House,
  },
  {
    name: "Search",
    path: "/search",
    icon: Search,
  },
  {
    name: "Cart",
    path: "/cart",
    icon: ShoppingCart,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: ClipboardList,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: User,
  },
];



export default function BottomNavigation() {


  const {
    totalItems
  } = useCart();

  const controls = useAnimation();
  const [previousItems, setPreviousItems] = useState(totalItems);

  useEffect(() => {
    if (totalItems > previousItems) {
      controls.start({
        scale:[1,1.35,1],
        rotate:[0,-12,12,0],
        transition:{duration:0.55}
      });
    }
    setPreviousItems(totalItems);
  }, [totalItems, previousItems, controls]);




  return (

    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-orange-100 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">


      <div className="mx-auto flex max-w-md items-center justify-around py-3">


        {
          menus.map((item)=>{


            const Icon = item.icon;



            return (

              <NavLink

                key={item.path}

                to={item.path}

              >

                {
                  ({isActive})=>(


                    <motion.div

                      whileTap={{
                        scale:0.85
                      }}

                      className={`relative flex flex-col items-center text-xs transition ${
                        isActive
                        ? "text-orange-500"
                        : "text-gray-500"
                      }`}

                    >


                      <div className="relative">


                        <motion.div
                          animate={item.name==="Cart" ? controls : {}}
                        >
                          <Icon size={23}/>
                        </motion.div>




                        {
                          item.name === "Cart" &&
                          totalItems > 0 && (

                            <motion.span

                              initial={{
                                scale:0
                              }}

                              animate={{
                                scale:[0,1.3,1]
                              }}
                              transition={{
                                type:"spring",
                                stiffness:300
                              }}

                              className="absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white"

                            >

                              {totalItems}

                            </motion.span>

                          )
                        }


                      </div>




                      <span className="mt-1">

                        {item.name}

                      </span>


                    </motion.div>


                  )
                }


              </NavLink>


            );


          })
        }


      </div>


    </nav>

  );

}
