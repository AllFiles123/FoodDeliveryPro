import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import {
  House,
  ShoppingCart,
  ClipboardList,
  User,
  Heart,
  MapPin,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

// আপনার চাহিদা অনুযায়ী আইকন পজিশন এবং পাথ সেট করা হয়েছে
const menus = [
  { name: "Home", path: "/home", icon: House },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Cart", path: "/cart", icon: ShoppingCart }, // ৩ নম্বর পজিশন
  { name: "Favorite", path: "/favorite", icon: Heart }, // পাথ রেডি
  { name: "Map", path: "/map", icon: MapPin },          // পাথ রেডি
  { name: "Profile", path: "/profile", icon: User },
];

export default function BottomNavigation() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4">
      {/* 
         Professional "Midnight Slate" Navigation Bar 
         এটি ইমেজের মতো দুই পাশে একদম রাউন্ড (Pill Shape) এবং গর্জিয়াস কালার
      */}
      <nav className="flex items-center justify-around w-full max-w-md bg-[#1A1D24] py-3 px-2 rounded-full shadow-[0_15px_40px_rgba(0,0,0,0.5)] border border-white/5">
        
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink key={item.path} to={item.path} className="flex justify-center">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full transition-all relative
                  ${isActive 
                    ? "bg-gradient-to-r from-[#FF3B30] to-[#E60023] text-white shadow-lg shadow-red-600/30" 
                    : "text-gray-500 hover:text-gray-400"}
                `}
              >
                {/* Icon & Perfect Circle Badge */}
                <div className="relative flex items-center justify-center">
                  <Icon size={isActive ? 18 : 22} strokeWidth={isActive ? 2.5 : 2} />
                  
                  {/* Cart Item Badge - নিখুঁত গোল শেপ ফিক্সড */}
                  {item.name === "Cart" && totalItems > 0 && (
                    <span className={`
                      absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2
                      ${isActive ? "ring-[#E60023] bg-[#1A1D24]" : "ring-[#1A1D24] bg-[#FF3B30]"}
                    `}>
                      {totalItems}
                    </span>
                  )}
                </div>

                {/* Active Text Label - শুধুমাত্র একটিভ আইটেমে দেখাবে */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
