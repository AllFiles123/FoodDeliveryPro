import { NavLink, useLocation } from "react-router-dom";
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
  { name: "Home", path: "/home", icon: House },
  { name: "Cart", path: "/cart", icon: ShoppingCart },
  { name: "Search", path: "/search", icon: Search, isCenter: true },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Profile", path: "/profile", icon: User },
];

export default function BottomNavigation() {
  const { totalItems } = useCart();
  const controls = useAnimation();
  const location = useLocation();
  const [previousItems, setPreviousItems] = useState(totalItems);

  useEffect(() => {
    if (totalItems > previousItems) {
      controls.start({
        scale: [1, 1.35, 1],
        rotate: [0, -12, 12, 0],
        transition: { duration: 0.55 }
      });
    }
    setPreviousItems(totalItems);
  }, [totalItems, previousItems, controls]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2 px-2">
      <div className="relative w-full max-w-[450px] h-[85px] flex items-end">
        
        {/* পাহাড়ের মতো বাঁকানো SVG ব্যাকগ্রাউন্ড */}
        <div className="absolute inset-0 z-0">
          <svg
            viewBox="0 0 400 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_-10px_25px_rgba(0,0,0,0.15)]"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40C0 17.9086 17.9086 0 40 0H145.429C155.039 0 164.211 4.08868 170.627 11.2338L181.714 23.5844C191.077 34.0156 208.923 34.0156 218.286 23.5844L229.373 11.2338C235.789 4.08868 244.961 0 254.571 0H360C382.091 0 400 17.9086 400 40V100H0V40Z"
              fill="#121417" // প্রিমিয়াম ডার্ক স্লেট কালার
            />
          </svg>
        </div>

        {/* মেনু আইটেমগুলো */}
        <nav className="relative z-10 w-full h-[70px] flex items-center justify-around px-4">
          {menus.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            // মাঝখানের গোল সার্চ বাটন
            if (item.isCenter) {
              return (
                <NavLink key={item.path} to={item.path} className="relative -top-10">
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#E31C25] to-[#FF4D4D] flex items-center justify-center shadow-xl shadow-red-500/30 border-[6px] border-[#FDFCFB]"
                  >
                    <Icon size={28} className="text-white" />
                  </motion.div>
                </NavLink>
              );
            }

            // অন্যান্য আইকনগুলো
            return (
              <NavLink key={item.path} to={item.path} className="flex flex-col items-center justify-center flex-1">
                <motion.div
                  animate={item.name === "Cart" ? controls : {}}
                  whileTap={{ scale: 0.8 }}
                  className="relative"
                >
                  <Icon
                    size={24}
                    className={`transition-all duration-300 ${
                      isActive ? "text-[#E31C25]" : "text-gray-500"
                    }`}
                  />

                  {/* কার্ট আইটেম কাউন্ট ব্যাজ */}
                  {item.name === "Cart" && totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#E31C25] text-[9px] font-bold text-white ring-2 ring-[#121417]">
                      {totalItems}
                    </span>
                  )}
                </motion.div>

                {/* ইমেজের মতো নিচের লাল ডট (Active Indicator) */}
                {isActive && (
                  <motion.div
                    layoutId="dot"
                    className="w-1.5 h-1.5 bg-[#E31C25] rounded-full mt-1.5 shadow-sm"
                  />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
