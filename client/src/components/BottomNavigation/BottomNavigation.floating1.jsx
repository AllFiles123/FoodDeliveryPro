import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

import {
  House,
  Package,
  Ticket,
  Receipt,
  User,
} from "lucide-react";


const menus = [
  {
    name:"Home",
    path:"/home",
    icon:House,
  },
  {
    name:"Orders",
    path:"/orders",
    icon:Package,
  },
  {
    name:"Offers",
    path:"/offers",
    icon:Ticket,
  },
  {
    name:"History",
    path:"/history",
    icon:Receipt,
  },
  {
    name:"Profile",
    path:"/profile",
    icon:User,
  },
];


export default function BottomNavigation(){

  return (

    <div className="fixed bottom-5 left-0 right-0 z-50 flex justify-center px-4">

      <nav
        className="
          flex items-center gap-1
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

                      transition={{
                        type:"spring",
                        stiffness:400,
                        damping:30
                      }}

                      className={`
                        flex items-center gap-2
                        rounded-full
                        px-3 py-2
                        transition-all
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
                          flex items-center justify-center
                          rounded-full
                          h-9 w-9
                          ${
                            isActive
                            ?
                            "bg-white text-primary"
                            :
                            ""
                          }
                        `}
                      >

                        <Icon size={21}/>

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
