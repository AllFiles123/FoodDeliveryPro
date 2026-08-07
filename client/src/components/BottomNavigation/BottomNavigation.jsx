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
      <div className="relative w-full max-w-lg h-[110px] flex items-end">
        
        {/* 'উঁচা-নিচা' পাহাড়ের মতো SVG ব্যাকগ্রাউন্ড - দুই সাইড নিচে নামানো */}
        <div className="absolute inset-0 z-0">
          <svg
            viewBox="0 0 400 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_-10px_20px_rgba(0,0,0,0.2)]"
            preserveAspectRatio="none"
          >
            {/* 
              এই পাথটি দুই পাশকে নিচে নামিয়ে মাঝখানে গভীর কার্ভ তৈরি করে 
              যাতে ডিজাইনটি একদম আপনার ইমেজের মতো উঁচু-নিচু দেখায়।
            */}
            <path
              d="M0 80 
                 C 40 80, 70 30, 130 30 
                 C 160 30, 175 95, 200 95 
                 C 225 95, 240 30, 270 30 
                 C 330 30, 360 80, 400 80 
                 V 100 
                 H 0 
                 Z"
              fill="#121212" // প্রিমিয়াম অবসিডিয়ান ব্ল্যাক
            />
          </svg>
        </div>

        {/* নেভিগেশন আইটেমস */}
        <nav className="relative z-10 w-full h-[75px] flex items-center justify-around px-2">
          {menus.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            // অনেক বড় মাঝখানের সার্চ বাটন (ইমেজের মতো)
            if (item.isCenter) {
              return (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className="relative -top-10"
                >
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="
                      w-20 h-20 
                      rounded-full 
                      bg-gradient-to-br from-[#FF2D55] to-[#D30030] 
                      flex items-center justify-center 
                      shadow-[0_15px_30px_rgba(211,0,48,0.4)] 
                      border-[7px] border-[#F9F9F9] 
                    "
                  >
                    <Icon size={34} className="text-white" strokeWidth={2.5} />
                  </motion.div>
                </NavLink>
              );
            }

            // অন্যান্য আইকনগুলো (সাইডগুলো এখন একটু উঁচুতে থাকবে)
            return (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className="flex flex-col items-center justify-center flex-1 h-full mb-3"
              >
                <motion.div
                  animate={item.name === "Cart" ? controls : {}}
                  whileTap={{ scale: 0.8 }}
                  className="relative"
                >
                  <Icon
                    size={26}
                    className={`transition-all duration-300 ${
                      isActive ? "text-[#FF2D55]" : "text-gray-500"
                    }`}
                  />

                  {/* কার্ট ব্যাজ */}
                  {item.name === "Cart" && totalItems > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF2D55] text-[9px] font-bold text-white ring-2 ring-[#121212]">
                      {totalItems}
                    </span>
                  )}
                </motion.div>

                {/* একটিভ ডট */}
                {isActive && (
                  <motion.div
                    layoutId="active-dot"
                    className="w-1.5 h-1.5 bg-[#FF2D55] rounded-full mt-2 shadow-[0_0_10px_rgba(255,45,85,0.7)]"
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
