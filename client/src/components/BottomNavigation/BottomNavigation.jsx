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

// ইমেজের ডিজাইন অনুযায়ী মেনু অর্ডার সাজানো হয়েছে
const menus = [
  { name: "Home", path: "/home", icon: House },
  { name: "Cart", path: "/cart", icon: ShoppingCart },
  { name: "Search", path: "/search", icon: Search, isCenter: true }, // মাঝখানের বাটন
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Profile", path: "/profile", icon: User },
];

export default function BottomNavigation() {
  const { totalItems } = useCart();
  const controls = useAnimation();
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
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 px-4">
      {/* মেইন নেভিগেশন কন্টেইনার */}
      <div className="relative flex items-center justify-between w-full max-w-md bg-[#1A1C1E] h-[70px] rounded-[30px] px-4 shadow-2xl shadow-black/40 border border-white/5">
        
        {/* মাঝখানের কার্ভ ডিজাইনের জন্য ব্যাকগ্রাউন্ড ইফেক্ট (Custom Notch) */}
        <div className="absolute left-1/2 -top-6 -translate-x-1/2 w-20 h-20 bg-[#FDFCFB] rounded-full flex items-center justify-center">
             <div className="w-[72px] h-[72px] bg-[#1A1C1E] rounded-full"></div>
        </div>

        {menus.map((item, index) => {
          const Icon = item.icon;

          // মাঝখানের বাটনের জন্য আলাদা স্টাইল (Search Button)
          if (item.isCenter) {
            return (
              <NavLink key={item.path} to={item.path} className="relative z-10 -mt-12">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF4D4D] to-[#FF7070] flex items-center justify-center shadow-lg shadow-[#FF4D4D]/40 border-4 border-[#1A1C1E]"
                >
                  <Icon size={24} className="text-white" />
                </motion.div>
              </NavLink>
            );
          }

          return (
            <NavLink key={item.path} to={item.path} className="relative z-10 flex-1">
              {({ isActive }) => (
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    animate={item.name === "Cart" ? controls : {}}
                    whileTap={{ scale: 0.8 }}
                    className="relative"
                  >
                    <Icon
                      size={24}
                      className={`transition-colors duration-300 ${
                        isActive ? "text-[#FF4D4D]" : "text-gray-500"
                      }`}
                    />

                    {/* কার্ট ব্যাজ */}
                    {item.name === "Cart" && totalItems > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#FF4D4D] text-[9px] font-bold text-white ring-2 ring-[#1A1C1E]">
                        {totalItems}
                      </span>
                    )}
                  </motion.div>

                  {/* একটিভ ডট (ইমেজের মতো) */}
                  {isActive && (
                    <motion.div
                      layoutId="activeDot"
                      className="w-1 h-1 bg-[#FF4D4D] rounded-full mt-1"
                    />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}
