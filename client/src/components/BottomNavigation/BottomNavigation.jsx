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
      <div className="relative w-full max-w-lg h-[95px] flex items-end">
        
        {/* পাহাড়ের মতো 'উঁচা-নিচা' বাঁকানো SVG ব্যাকগ্রাউন্ড */}
        <div className="absolute inset-0 z-0">
          <svg
            viewBox="0 0 400 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_-5px_15px_rgba(0,0,0,0.1)]"
            preserveAspectRatio="none"
          >
            {/* 
              এই পাথটি একদম পিক্সেল পারফেক্ট বাঁক (Notch) তৈরি করবে।
              মাঝখানে একটি গভীর 'V' বা 'U' শেপ আছে যা ইমেজের সাথে মিলবে।
            */}
            <path
              d="M0 40 
                 C 0 40, 10 30, 40 30 
                 L 140 30 
                 C 165 30, 175 80, 200 80 
                 C 225 80, 235 30, 260 30 
                 L 360 30 
                 C 390 30, 400 40, 400 40 
                 V 100 
                 H 0 
                 Z"
              fill="#0F1113" // প্রিমিয়াম ডার্ক চারকোল কালার
            />
          </svg>
        </div>

        {/* নেভিগেশন আইটেমস */}
        <nav className="relative z-10 w-full h-[70px] flex items-center justify-around px-2">
          {menus.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            // মাঝখানের 'নিচু' জায়গায় বসানো সার্চ বাটন
            if (item.isCenter) {
              return (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className="relative -top-8"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="
                      w-15 h-15 
                      sm:w-16 sm:h-16 
                      rounded-full 
                      bg-gradient-to-br from-[#FF3B30] to-[#E60000] 
                      flex items-center justify-center 
                      shadow-[0_10px_20px_rgba(230,0,0,0.4)] 
                      border-[6px] border-[#F4F4F4] // এটি আপনার পেজের ব্যাকগ্রাউন্ড কালারের সাথে মিলবে
                    "
                  >
                    <Icon size={28} className="text-white" />
                  </motion.div>
                </NavLink>
              );
            }

            // অন্যান্য আইকন
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className="flex flex-col items-center justify-center flex-1 h-full mb-1"
              >
                <motion.div
                  animate={item.name === "Cart" ? controls : {}}
                  whileTap={{ scale: 0.8 }}
                  className="relative"
                >
                  <Icon
                    size={24}
                    className={`transition-all duration-300 ${
                      isActive ? "text-[#FF3B30]" : "text-gray-400"
                    }`}
                  />

                  {/* কার্ট ব্যাজ */}
                  {item.name === "Cart" && totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF3B30] text-[9px] font-bold text-white ring-2 ring-[#0F1113]">
                      {totalItems}
                    </span>
                  )}
                </motion.div>

                {/* একটিভ ডট ইডিকেটর */}
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="w-1.5 h-1.5 bg-[#FF3B30] rounded-full mt-1 shadow-[0_0_8px_rgba(255,59,48,0.6)]"
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
