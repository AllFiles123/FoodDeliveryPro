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
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-0">
      <div className="relative w-full max-w-lg h-[100px] flex items-end">
        
        {/* পাহাড়ের মতো উঁচু-নিচু ঢেউ (SVG) - যা আইকনগুলোকে ভেতরে রাখবে */}
        <div className="absolute inset-0 z-0">
          <svg
            viewBox="0 0 400 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_-10px_25px_rgba(0,0,0,0.3)]"
            preserveAspectRatio="none"
          >
            {/* 
              পাথটিকে অনেক উঁচুতে (y=10) তোলা হয়েছে যাতে হোম এবং প্রোফাইল আইকন 
              ঢেউয়ের কালো অংশের ভেতরে থাকে।
            */}
            <path
              d="M0 100 
                 V 40 
                 C 30 40, 60 10, 100 10 
                 L 140 10 
                 C 170 10, 180 85, 200 85 
                 C 220 85, 230 10, 260 10 
                 L 300 10 
                 C 340 10, 370 40, 400 40 
                 V 100 
                 H 0 
                 Z"
              fill="#0F1113" // প্রিমিয়াম ডার্ক চারকোল
            />
          </svg>
        </div>

        {/* আইকনগুলো ঢেউয়ের ঠিক ভেতরে সাজানো */}
        <nav className="relative z-10 w-full h-[75px] flex items-center justify-around px-2 mb-2">
          {menus.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            // অনেক বড় মাঝখানের সার্চ বাটন
            if (item.isCenter) {
              return (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className="relative -top-6"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="
                      w-20 h-20 
                      rounded-full 
                      bg-gradient-to-br from-[#FF2D55] to-[#D30030] 
                      flex items-center justify-center 
                      shadow-[0_15px_30px_rgba(211,0,48,0.4)] 
                      border-[7px] border-[#F4F4F4] // আপনার পেজের ব্যাকগ্রাউন্ড কালার
                    "
                  >
                    <Icon size={34} className="text-white" strokeWidth={2.5} />
                  </motion.div>
                </NavLink>
              );
            }

            // সাইড আইকনগুলো (হোম, কার্ট, অর্ডার, প্রোফাইল)
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className="flex flex-col items-center justify-center flex-1 h-full pt-4"
              >
                <motion.div
                  animate={item.name === "Cart" ? controls : {}}
                  whileTap={{ scale: 0.8 }}
                  className="relative"
                >
                  <Icon
                    size={26}
                    className={`transition-all duration-300 ${
                      isActive ? "text-[#FF2D55]" : "text-gray-400"
                    }`}
                  />

                  {/* কার্ট ব্যাজ */}
                  {item.name === "Cart" && totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2D55] text-[9px] font-bold text-white ring-2 ring-[#0F1113]">
                      {totalItems}
                    </span>
                  )}
                </motion.div>

                {/* একটিভ ইন্ডিকেটর ডট */}
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="w-1.5 h-1.5 bg-[#FF2D55] rounded-full mt-1.5 shadow-[0_0_8px_rgba(255,45,85,0.6)]"
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
