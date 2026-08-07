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

// আপনার চাহিদা অনুযায়ী আইকন সোয়াপ করা হয়েছে
const menus = [
  { name: "Home", path: "/home", icon: House },
  { name: "Orders", path: "/orders", icon: ClipboardList },
  { name: "Cart", path: "/cart", icon: ShoppingCart }, // ৩ নম্বর পজিশনে কার্ট
  { name: "Favorite", path: "/favorite", icon: Heart },
  { name: "Map", path: "/map", icon: MapPin }, // ৫ নম্বর পজিশনে ম্যাপ
  { name: "Profile", path: "/profile", icon: User },
];

export default function BottomNavigation() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center w-full">
      {/* 
         Professional "Midnight Slate" Navigation Bar 
         এটি স্ক্রিনের একদম নিচে লেগে থাকবে এবং প্রফেশনাল গর্জিয়াস কালার দেওয়া হয়েছে
      */}
      <nav className="flex items-center justify-around w-full bg-[#1A1D24] pt-4 pb-6 px-4 border-t border-white/5 shadow-[0_-8px_30px_rgba(0,0,0,0.3)]">
        
        {menus.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink key={item.path} to={item.path} className="flex flex-col items-center">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-full transition-all relative
                  ${isActive 
                    ? "bg-gradient-to-r from-[#FF3B30] to-[#FF2D55] text-white shadow-lg shadow-red-500/20" 
                    : "text-gray-500"}
                `}
              >
                {/* Icon Section */}
                <div className="relative flex items-center justify-center">
                  <Icon size={isActive ? 18 : 22} strokeWidth={isActive ? 2.5 : 2} />
                  
                  {/* Cart Item Badge Logic - Original Logic Intact */}
                  {item.name === "Cart" && totalItems > 0 && (
                    <span className={`
                      absolute -right-2.5 -top-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2
                      ${isActive ? "ring-[#FF2D55] bg-[#1A1D24]" : "ring-[#1A1D24] bg-[#FF3B30]"}
                    `}>
                      {totalItems}
                    </span>
                  )}
                </div>

                {/* Active Text Label - ইমেজের মতো অ্যানিমেশন */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-[11px] font-black whitespace-nowrap overflow-hidden"
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
