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
    name:"Home",
    path:"/home",
    icon:House,
  },
  {
    name:"Search",
    path:"/search",
    icon:Search,
  },
  {
    name:"Cart",
    path:"/cart",
    icon:ShoppingCart,
  },
  {
    name:"Orders",
    path:"/orders",
    icon:ClipboardList,
  },
  {
    name:"Profile",
    path:"/profile",
    icon:User,
  },
];


export default function BottomNavigation(){

  const { totalItems } = useCart();

  const controls = useAnimation();

  const [previousItems,setPreviousItems] =
    useState(totalItems);


  useEffect(()=>{

    if(totalItems > previousItems){

      controls.start({
        scale:[1,1.35,1],
        rotate:[0,-12,12,0],
        transition:{
          duration:0.55
        }
      });

    }

    setPreviousItems(totalItems);

  },[
    totalItems,
    previousItems,
    controls
  ]);



  return (

    <div
      className="
        fixed
        bottom-2
        left-0
        right-0
        z-50
        flex
        justify-center
        px-3
      "
    >

      <nav
        className="
          flex
          items-center
          gap-1
          rounded-full
          bg-border
          p-2
          shadow-xl
        "
      >

        {
          menus.map((item)=>{

            const Icon=item.icon;


            return(

              <NavLink
                key={item.path}
                to={item.path}
              >

                {
                  ({isActive})=>(

                    <motion.div

                      layout

                      whileTap={{
                        scale:0.9
                      }}

                      transition={{
                        type:"spring",
                        stiffness:400,
                        damping:30
                      }}

                      className={`
                        flex
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-2
                        ${
                          isActive
                          ?
                          "bg-primary text-white"
                          :
                          "text-gray-900"
                        }
                      `}
                    >


                      <div
                        className={`
                          relative
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-full
                          ${
                            isActive
                            ?
                            "bg-white text-primary"
                            :
                            ""
                          }
                        `}
                      >

                        <motion.div
                          animate={
                            item.name==="Cart"
                            ?
                            controls
                            :
                            {}
                          }
                        >

                          <Icon size={21}/>

                        </motion.div>


                        {
                          item.name==="Cart" &&
                          totalItems>0 &&

                          <span
                            className="
                              absolute
                              -right-2
                              -top-2
                              flex
                              h-5
                              w-5
                              items-center
                              justify-center
                              rounded-full
                              bg-primary
                              text-[10px]
                              font-bold
                              text-white
                            "
                          >

                            {totalItems}

                          </span>

                        }


                      </div>



                      {
                        isActive &&

                        <motion.span

                          initial={{
                            opacity:0,
                            width:0
                          }}

                          animate={{
                            opacity:1,
                            width:"auto"
                          }}

                          className="
                            text-sm
                            font-bold
                            whitespace-nowrap
                          "
                        >

                          {item.name}

                        </motion.span>

                      }


                    </motion.div>

                  )
                }


              </NavLink>

            );

          })
        }


      </nav>


    </div>

  );

}
